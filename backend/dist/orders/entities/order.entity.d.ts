import { TableEntity } from '../../tables/entities/table.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    NEW = "NEW",
    PREPARING = "PREPARING",
    SERVING = "SERVING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: number;
    table: TableEntity;
    user: User;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
}
