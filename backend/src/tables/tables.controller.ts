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

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: TableStatus) {
    return this.tablesService.updateStatus(+id, status);
  }
}
