import { TablesService } from './tables.service';
import { TableStatus } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
export declare class TablesController {
    private tablesService;
    constructor(tablesService: TablesService);
    create(body: CreateTableDto): Promise<import("./entities/table.entity").TableEntity>;
    findAll(): Promise<import("./entities/table.entity").TableEntity[]>;
    getTotal(id: string): Promise<{
        tableId: number;
        total: number;
    }>;
    close(id: string, body: any): Promise<{
        success: boolean;
        tableId: number;
        total: number;
        archivedOrders: number;
        historyId: number;
    }>;
    history(): Promise<import("./entities/table-history.entity").TableHistory[]>;
    historyOne(id: string): Promise<import("./entities/table-history.entity").TableHistory>;
    updateStatus(id: string, status: TableStatus): Promise<import("./entities/table.entity").TableEntity>;
}
