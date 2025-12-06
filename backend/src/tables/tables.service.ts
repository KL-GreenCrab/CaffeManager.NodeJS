import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(@InjectRepository(TableEntity) private repo: Repository<TableEntity>) {}

  create(data: Partial<TableEntity>) {
    const t = this.repo.create(data);
    return this.repo.save(t);
  }

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }

  async updateStatus(id: number, status: TableStatus) {
    const t = await this.findOne(id);
    if (!t) throw new NotFoundException('Table not found');
    t.status = status;
    return this.repo.save(t);
  }
}
