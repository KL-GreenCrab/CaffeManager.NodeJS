"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const table_entity_1 = require("./entities/table.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_entity_2 = require("../orders/entities/order.entity");
const table_history_entity_1 = require("./entities/table-history.entity");
const order_history_entity_1 = require("../orders/entities/order-history.entity");
let TablesService = class TablesService {
    constructor(repo, tableHistoryRepo) {
        this.repo = repo;
        this.tableHistoryRepo = tableHistoryRepo;
    }
    async getTableTotal(tableId) {
        const orders = await this.repo.manager.getRepository(order_entity_1.Order).find({ where: { table: { id: tableId } } });
        const total = orders.reduce((s, o) => s + Number(o.total || 0), 0);
        return { tableId, total };
    }
    async closeTable(tableId, performedBy) {
        var _a;
        const t = await this.findOne(tableId);
        if (!t)
            throw new common_1.NotFoundException('Table not found');
        const orderRepo = this.repo.manager.getRepository(order_entity_1.Order);
        const ordersAll = await orderRepo.find({ where: { table: { id: tableId } }, relations: ['items', 'user'] });
        const orders = ordersAll.filter((o) => o.status !== order_entity_2.OrderStatus.COMPLETED);
        const orderHistoryRepo = this.repo.manager.getRepository(order_history_entity_1.OrderHistory);
        const snapshots = [];
        let total = 0;
        for (const o of orders) {
            total += Number(o.total || 0);
            const oh = orderHistoryRepo.create({ orderId: o.id, tableId: tableId, userId: ((_a = o.user) === null || _a === void 0 ? void 0 : _a.id) || null, total: Number(o.total), itemsJson: JSON.stringify(o.items || []) });
            await orderHistoryRepo.save(oh);
            snapshots.push({ orderId: o.id, total: o.total, items: o.items });
            o.status = order_entity_2.OrderStatus.COMPLETED;
            await orderRepo.save(o);
        }
        const th = this.tableHistoryRepo.create({ tableId, total, ordersJson: JSON.stringify(snapshots) });
        await this.tableHistoryRepo.save(th);
        t.status = table_entity_1.TableStatus.EMPTY;
        await this.repo.save(t);
        return { success: true, tableId, total, archivedOrders: snapshots.length, historyId: th.id };
    }
    listTableHistory() {
        return this.tableHistoryRepo.find({ order: { closedAt: 'DESC' } });
    }
    getTableHistory(id) {
        return this.tableHistoryRepo.findOne({ where: { id } });
    }
    create(data) {
        const t = this.repo.create(data);
        return this.repo.save(t);
    }
    findAll() { return this.repo.find(); }
    findOne(id) { return this.repo.findOne({ where: { id } }); }
    async updateStatus(id, status) {
        const t = await this.findOne(id);
        if (!t)
            throw new common_1.NotFoundException('Table not found');
        t.status = status;
        return this.repo.save(t);
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_entity_1.TableEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(table_history_entity_1.TableHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TablesService);
//# sourceMappingURL=tables.service.js.map