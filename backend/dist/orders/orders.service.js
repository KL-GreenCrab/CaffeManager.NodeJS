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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_history_entity_1 = require("./entities/order-history.entity");
const product_entity_1 = require("../products/entities/product.entity");
const table_entity_1 = require("../tables/entities/table.entity");
const table_history_entity_1 = require("../tables/entities/table-history.entity");
let OrdersService = class OrdersService {
    constructor(orderRepo, itemRepo, productRepo, tableRepo, orderHistoryRepo, tableHistoryRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
        this.tableRepo = tableRepo;
        this.orderHistoryRepo = orderHistoryRepo;
        this.tableHistoryRepo = tableHistoryRepo;
    }
    async create(dto, user) {
        const table = await this.tableRepo.findOne({ where: { id: dto.tableId } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        if (!dto.items || dto.items.length === 0)
            throw new common_1.BadRequestException('Items empty');
        const items = [];
        let total = 0;
        for (const it of dto.items) {
            const p = await this.productRepo.findOne({ where: { id: it.productId } });
            if (!p)
                throw new common_1.NotFoundException(`Product ${it.productId} not found`);
            const price = Number(p.price);
            const oi = this.itemRepo.create({ product: p, quantity: it.quantity, price });
            items.push(oi);
            total += price * it.quantity;
        }
        const order = this.orderRepo.create({ table, user: user || null, items, total, status: order_entity_1.OrderStatus.NEW });
        table.status = table_entity_1.TableStatus.OCCUPIED;
        await this.tableRepo.save(table);
        return this.orderRepo.save(order);
    }
    findByTable(tableId) {
        return this.orderRepo.find({
            where: { table: { id: tableId } },
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'ASC' },
        });
    }
    findAll() {
        return this.orderRepo.find({ order: { createdAt: 'DESC' } });
    }
    findOne(id) {
        return this.orderRepo.findOne({ where: { id }, relations: ['items', 'items.product', 'table', 'user'] });
    }
    async updateStatus(id, status) {
        const o = await this.findOne(id);
        if (!o)
            throw new common_1.NotFoundException('Order not found');
        o.status = status;
        if (status === 'COMPLETED') {
            const t = o.table;
            if (t) {
                t.status = table_entity_1.TableStatus.EMPTY;
                await this.tableRepo.save(t);
            }
        }
        return this.orderRepo.save(o);
    }
    async updateItemQuantity(orderId, itemId, qty) {
        const order = await this.findOne(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        if (qty <= 0) {
            order.total = Number(order.total) - Number(item.price) * item.quantity;
            await this.itemRepo.remove(item);
        }
        else {
            order.total = Number(order.total) - Number(item.price) * item.quantity + Number(item.price) * qty;
            item.quantity = qty;
            await this.itemRepo.save(item);
        }
        return this.orderRepo.save(order);
    }
    async payOrder(orderId, user, body) {
        var _a;
        const order = await this.findOne(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = order_entity_1.OrderStatus.COMPLETED;
        await this.orderRepo.save(order);
        const itemsJson = JSON.stringify(order.items.map(it => ({ name: it.product.name, price: it.price, quantity: it.quantity })));
        const h = this.orderHistoryRepo.create({
            orderId: order.id,
            tableId: (_a = order.table) === null || _a === void 0 ? void 0 : _a.id,
            userId: user.id,
            total: order.total,
            itemsJson,
            paidAt: new Date(),
        });
        return this.orderHistoryRepo.save(h);
    }
    async addItem(orderId, productId, quantity) {
        const order = await this.findOne(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const price = Number(product.price);
        const item = this.itemRepo.create({ product, quantity, price });
        order.items.push(item);
        order.total = Number(order.total) + price * quantity;
        return this.orderRepo.save(order);
    }
    listOrderHistory() {
        return this.orderHistoryRepo.find({ order: { paidAt: 'DESC' } });
    }
    getOrderHistory(id) {
        return this.orderHistoryRepo.findOne({ where: { id } });
    }
    async removeItem(orderId, itemId) {
        const order = await this.findOne(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        order.total = Number(order.total) - Number(item.price) * item.quantity;
        await this.itemRepo.remove(item);
        return this.orderRepo.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(table_entity_1.TableEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(order_history_entity_1.OrderHistory)),
    __param(5, (0, typeorm_1.InjectRepository)(table_history_entity_1.TableHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map