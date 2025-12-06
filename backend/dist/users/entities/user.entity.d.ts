import { Role } from '../../roles/entities/role.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    fullName: string;
    role: Role;
    orders: Order[];
}
