export declare enum ProductType {
    COFFEE = "coffee",
    TEA = "tea",
    SMOOTHIE = "smoothie",
    SODA = "soda",
    JUICE = "juice"
}
export declare class Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    isAvailable: boolean;
    type: ProductType;
}
