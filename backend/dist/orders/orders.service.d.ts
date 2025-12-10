import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Product } from '../products/entities/product.entity';
import { TableEntity } from '../tables/entities/table.entity';
import { TableHistory } from '../tables/entities/table-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepo;
    private itemRepo;
    private productRepo;
    private tableRepo;
    private orderHistoryRepo;
    private tableHistoryRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, productRepo: Repository<Product>, tableRepo: Repository<TableEntity>, orderHistoryRepo: Repository<OrderHistory>, tableHistoryRepo: Repository<TableHistory>);
    create(dto: CreateOrderDto, user: any): Promise<Order>;
    findByTable(tableId: number): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, status: string): Promise<Order>;
    updateItemQuantity(orderId: number, itemId: number, qty: number): Promise<Order>;
    payOrder(orderId: number, user: any, body: any): Promise<OrderHistory>;
    addItem(orderId: number, productId: number, quantity: number): Promise<Order>;
    listOrderHistory(): Promise<OrderHistory[]>;
    getOrderHistory(id: number): Promise<OrderHistory>;
    removeItem(orderId: number, itemId: number): Promise<Order>;
}
