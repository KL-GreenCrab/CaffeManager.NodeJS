import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: string): Promise<import("./entities/order.entity").Order>;
    pay(id: string, body: any, req: any): Promise<{
        success: boolean;
        order: import("./entities/order.entity").Order;
        historyId: number;
    }>;
    addItem(id: string, dto: AddItemDto): Promise<import("./entities/order.entity").Order>;
    editItem(id: string, itemId: string, quantity: number): Promise<import("./entities/order.entity").Order>;
    history(): Promise<import("./entities/order-history.entity").OrderHistory[]>;
    historyOne(id: string): Promise<import("./entities/order-history.entity").OrderHistory>;
    removeItem(id: string, itemId: string): Promise<import("./entities/order.entity").Order>;
}
