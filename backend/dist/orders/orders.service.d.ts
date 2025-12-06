import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { TableEntity } from '../tables/entities/table.entity';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepo;
    private itemRepo;
    private productRepo;
    private tableRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, productRepo: Repository<Product>, tableRepo: Repository<TableEntity>);
    create(dto: CreateOrderDto, user: any): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, status: string): Promise<Order>;
    addItem(orderId: number, productId: number, qty: number): Promise<Order>;
    removeItem(orderId: number, itemId: number): Promise<Order>;
}
