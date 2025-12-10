import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './entities/table.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/entities/order.entity';
import { TableHistory } from './entities/table-history.entity';

import { OrderHistory } from '../orders/entities/order-history.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TableEntity) private repo: Repository<TableEntity>,
    @InjectRepository(TableHistory) private tableHistoryRepo: Repository<TableHistory>,
  ) {}

  async getTableTotal(tableId: number) {
    // sum totals of non-COMPLETED orders for this table
    const orders = await this.repo.manager.getRepository(Order).find({ where: { table: { id: tableId } } });
    const total = orders.reduce((s, o: any) => s + Number(o.total || 0), 0);
    return { tableId, total };
  }

  async closeTable(tableId: number, performedBy?: number) {
    const t = await this.findOne(tableId);
    if (!t) throw new NotFoundException('Table not found');

    // find all orders for this table that are not COMPLETED
    const orderRepo = this.repo.manager.getRepository(Order);
    const ordersAll = await orderRepo.find({ where: { table: { id: tableId } } as any, relations: ['items', 'user'] });
    const orders = ordersAll.filter((o:any) => o.status !== OrderStatus.COMPLETED);

    // create order histories and mark orders completed
    const orderHistoryRepo = this.repo.manager.getRepository(OrderHistory);
    const snapshots: any[] = [];
    let total = 0;
    for (const o of orders) {
      total += Number(o.total || 0);
      const oh = orderHistoryRepo.create({ orderId: o.id, tableId: tableId, userId: o.user?.id || null, total: Number(o.total), itemsJson: JSON.stringify(o.items || []) });
      await orderHistoryRepo.save(oh);
      snapshots.push({ orderId: o.id, total: o.total, items: o.items });
      o.status = OrderStatus.COMPLETED;
      await orderRepo.save(o);
    }

    // record table history
    const th = this.tableHistoryRepo.create({ tableId, total, ordersJson: JSON.stringify(snapshots) });
    await this.tableHistoryRepo.save(th);

    // set table empty
    t.status = TableStatus.EMPTY;
    await this.repo.save(t);

    return { success: true, tableId, total, archivedOrders: snapshots.length, historyId: th.id };
  }

  listTableHistory() {
    return this.tableHistoryRepo.find({ order: { closedAt: 'DESC' } });
  }

  getTableHistory(id: number) {
    return this.tableHistoryRepo.findOne({ where: { id } });
  }

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
