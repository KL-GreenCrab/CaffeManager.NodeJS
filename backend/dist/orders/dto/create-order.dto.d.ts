declare class ItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    tableId: number;
    items: ItemDto[];
}
export {};
