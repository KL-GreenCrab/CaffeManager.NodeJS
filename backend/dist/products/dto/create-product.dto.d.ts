import { ProductType } from '../entities/product.entity';
export declare class CreateProductDto {
    name: string;
    price: number;
    description?: string;
    image?: string;
    isAvailable?: boolean;
    type?: ProductType;
}
