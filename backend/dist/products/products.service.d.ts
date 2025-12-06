import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private repo;
    constructor(repo: Repository<Product>);
    create(data: Partial<Product>): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, data: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<Product>;
}
