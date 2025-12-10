import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddItemDto } from './dto/add-item.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findByTable(tableId: string): Promise<import("./entities/order.entity").Order[]>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: string): Promise<import("./entities/order.entity").Order>;
    pay(id: string, body: any, req: any): Promise<import("./entities/order-history.entity").OrderHistory>;
    addItem(id: string, dto: AddItemDto): Promise<import("./entities/order.entity").Order>;
    editItem(id: string, itemId: string, quantity: number): Promise<import("./entities/order.entity").Order>;
    removeItem(id: string, itemId: string): Promise<import("./entities/order.entity").Order>;
}
