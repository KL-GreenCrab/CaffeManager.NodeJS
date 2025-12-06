import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './entities/table.entity';
export declare class TablesService {
    private repo;
    constructor(repo: Repository<TableEntity>);
    create(data: Partial<TableEntity>): Promise<TableEntity>;
    findAll(): Promise<TableEntity[]>;
    findOne(id: number): Promise<TableEntity>;
    updateStatus(id: number, status: TableStatus): Promise<TableEntity>;
}
