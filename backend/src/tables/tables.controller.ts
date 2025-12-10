import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
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
  getTotal(@Param('id') id: string) { return this.tablesService.getTableTotal(+id); }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() body: any) { return this.tablesService.closeTable(+id, body?.performedBy); }

  @Get('history')
  history() { return this.tablesService.listTableHistory(); }

  @Get('history/:id')
  historyOne(@Param('id') id: string) { return this.tablesService.getTableHistory(+id); }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: TableStatus) {
    return this.tablesService.updateStatus(+id, status);
  }
}
