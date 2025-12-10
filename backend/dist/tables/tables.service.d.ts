import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './entities/table.entity';
import { TableHistory } from './entities/table-history.entity';
export declare class TablesService {
    private repo;
    private tableHistoryRepo;
    constructor(repo: Repository<TableEntity>, tableHistoryRepo: Repository<TableHistory>);
    getTableTotal(tableId: number): Promise<{
        tableId: number;
        total: number;
    }>;
    closeTable(tableId: number, performedBy?: number): Promise<{
        success: boolean;
        tableId: number;
        total: number;
        archivedOrders: number;
        historyId: number;
    }>;
    listTableHistory(): Promise<TableHistory[]>;
    getTableHistory(id: number): Promise<TableHistory>;
    create(data: Partial<TableEntity>): Promise<TableEntity>;
    findAll(): Promise<TableEntity[]>;
    findOne(id: number): Promise<TableEntity>;
    updateStatus(id: number, status: TableStatus): Promise<TableEntity>;
}
