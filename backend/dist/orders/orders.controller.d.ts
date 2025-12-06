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
    addItem(id: string, dto: AddItemDto): Promise<import("./entities/order.entity").Order>;
    removeItem(id: string, itemId: string): Promise<import("./entities/order.entity").Order>;
}
