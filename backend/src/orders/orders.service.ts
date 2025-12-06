import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { TableEntity, TableStatus } from '../tables/entities/table.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(TableEntity) private tableRepo: Repository<TableEntity>,
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

  findAll() {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id } });
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

  async addItem(orderId: number, productId: number, qty: number) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    const p = await this.productRepo.findOne({ where: { id: productId } });
    if (!p) throw new NotFoundException('Product not found');
    const oi = this.itemRepo.create({ order, product: p, quantity: qty, price: Number(p.price) });
    order.items.push(oi);
    order.total = Number(order.total) + Number(oi.price) * qty;
    await this.itemRepo.save(oi);
    return this.orderRepo.save(order);
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
