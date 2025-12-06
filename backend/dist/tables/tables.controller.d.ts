import { TablesService } from './tables.service';
import { TableStatus } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
export declare class TablesController {
    private tablesService;
    constructor(tablesService: TablesService);
    create(body: CreateTableDto): Promise<import("./entities/table.entity").TableEntity>;
    findAll(): Promise<import("./entities/table.entity").TableEntity[]>;
    updateStatus(id: string, status: TableStatus): Promise<import("./entities/table.entity").TableEntity>;
}
