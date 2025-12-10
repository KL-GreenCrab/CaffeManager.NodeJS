import { Controller, Get, Post, Body, Param, Put, BadRequestException } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TableStatus } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Post()
  create(@Body() body: CreateTableDto) { return this.tablesService.create(body); }

  @Get()
  findAll() { return this.tablesService.findAll(); }

  @Get(':id/total')
  getTotal(@Param('id') id: string) {
    const tableId = +id;
    if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
    return this.tablesService.getTableTotal(tableId);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() body: any) {
    const tableId = +id;
    if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
    return this.tablesService.closeTable(tableId, body?.performedBy);
  }

  @Get('history')
  history() { return this.tablesService.listTableHistory(); }

  @Get('history/:id')
  historyOne(@Param('id') id: string) {
    const historyId = +id;
    if (isNaN(historyId)) throw new BadRequestException('Invalid history ID');
    return this.tablesService.getTableHistory(historyId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: TableStatus) {
    const tableId = +id;
    if (isNaN(tableId)) throw new BadRequestException('Invalid table ID');
    return this.tablesService.updateStatus(tableId, status);
  }
}