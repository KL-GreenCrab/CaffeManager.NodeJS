import { Order } from '../../orders/entities/order.entity';
export declare enum TableStatus {
    EMPTY = "EMPTY",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED"
}
export declare class TableEntity {
    id: number;
    name: string;
    status: TableStatus;
    orders: Order[];
}
