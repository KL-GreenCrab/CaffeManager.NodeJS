import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Product } from '../products/entities/product.entity';
import { TableEntity, TableStatus } from '../tables/entities/table.entity';
import { TableHistory } from '../tables/entities/table-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(TableEntity) private tableRepo: Repository<TableEntity>,
    @InjectRepository(OrderHistory) private orderHistoryRepo: Repository<OrderHistory>,
    @InjectRepository(TableHistory) private tableHistoryRepo: Repository<TableHistory>,
  ) {}

  async create(dto: CreateOrderDto, user: any) {
    const table = await this.tableRepo.findOne({ where: { id: dto.tableId } });
    if (!table) throw new NotFoundException('Table not found');

    if (!dto.items || dto.items.length === 0) throw new BadRequestException('Items empty');

    const items: OrderItem[] = [];
    let total = 0;

    for (const it of dto.items) {
      const p = await this.productRepo.findOne({ where: { id: it.productId } });
      if (!p) throw new NotFoundException(`Product ${it.productId} not found`);
      const price = Number(p.price);
      const oi = this.itemRepo.create({ product: p, quantity: it.quantity, price });
      items.push(oi);
      total += price * it.quantity;
    }

    const order = this.orderRepo.create({ table, user: user || null, items, total, status: OrderStatus.NEW });

    table.status = TableStatus.OCCUPIED;
    await this.tableRepo.save(table);

    return this.orderRepo.save(order);
  }

  findByTable(tableId: number) {
    return this.orderRepo.find({
      where: { table: { id: tableId } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'ASC' },
    });
  }

  findAll() {
    return this.orderRepo.find({ relations: ['user', 'items', 'items.product'] });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const productRepo = this.orderRepo.manager.getRepository(Product);
    const orderItemRepo = this.orderRepo.manager.getRepository(OrderItem);

    // Remove old items
    if (order.items && order.items.length > 0) {
      await orderItemRepo.remove(order.items);
    }

    let total = 0;
    const newItems: OrderItem[] = [];

    for (const itemDto of updateOrderDto.items) {
      if (itemDto.quantity <= 0) {
        continue;
      }
      
      const product = await productRepo.findOne({ where: { id: itemDto.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
      }
      
      const item = orderItemRepo.create({
        product: product,
        quantity: itemDto.quantity,
        price: product.price,
        order: order,
      });
      
      await orderItemRepo.save(item);

      newItems.push(item);
      total += item.price * item.quantity;
    }

    order.items = newItems;
    order.total = total;

    return this.orderRepo.save(order);
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id }, relations: ['user', 'items', 'items.product'] });
  }

  async updateStatus(id: number, status: string) {
    const o = await this.findOne(id);
    if (!o) throw new NotFoundException('Order not found');
    o.status = status as OrderStatus;
    if (status === 'COMPLETED') {
      const t = o.table;
      if (t) {
        t.status = TableStatus.EMPTY;
        await this.tableRepo.save(t);
      }
    }
    return this.orderRepo.save(o);
  }

  async updateItemQuantity(orderId: number, itemId: number, qty: number) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');
    if (qty <= 0) {
      // remove item
      order.total = Number(order.total) - Number(item.price) * item.quantity;
      await this.itemRepo.remove(item);
    } else {
      // update
      order.total = Number(order.total) - Number(item.price) * item.quantity + Number(item.price) * qty;
      item.quantity = qty;
      await this.itemRepo.save(item);
    }
    return this.orderRepo.save(order);
  }

  async payOrder(orderId: number, user: any, body: any) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    // mark as completed
    order.status = OrderStatus.COMPLETED;
    await this.orderRepo.save(order);
    // create history
    const itemsJson = JSON.stringify(order.items.map(it => ({ name: it.product.name, price: it.price, quantity: it.quantity })));
    const h = this.orderHistoryRepo.create({
      orderId: order.id,
      tableId: order.table?.id,
      userId: user.id,
      total: order.total,
      itemsJson,
      paidAt: new Date(),
    });
    return this.orderHistoryRepo.save(h);
  }

  async addItem(orderId: number, productId: number, quantity: number) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const price = Number(product.price);
    const item = this.itemRepo.create({ product, quantity, price });
    order.items.push(item);
    order.total = Number(order.total) + price * quantity;
    return this.orderRepo.save(order);
  }

  listOrderHistory() {
    return this.orderHistoryRepo.find({ order: { paidAt: 'DESC' } });
  }

  getOrderHistory(id: number) {
    return this.orderHistoryRepo.findOne({ where: { id } });
  }

  async removeItem(orderId: number, itemId: number) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item not found');
    order.total = Number(order.total) - Number(item.price) * item.quantity;
    await this.itemRepo.remove(item);
    return this.orderRepo.save(order);
  }
}