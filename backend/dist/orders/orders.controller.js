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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const add_item_dto_1 = require("./dto/add-item.dto");
const passport_1 = require("@nestjs/passport");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(dto, req) {
        const user = req.user;
        return this.ordersService.create(dto, user);
    }
    findAll() { return this.ordersService.findAll(); }
    findByTable(tableId) {
        const id = +tableId;
        if (isNaN(id))
            throw new common_1.BadRequestException('Invalid table ID');
        return this.ordersService.findByTable(id);
    }
    history() { return this.ordersService.listOrderHistory(); }
    historyOne(id) {
        const historyId = +id;
        if (isNaN(historyId))
            throw new common_1.BadRequestException('Invalid history ID');
        return this.ordersService.getOrderHistory(historyId);
    }
    findOne(id) {
        const orderId = +id;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        return this.ordersService.findOne(orderId);
    }
    updateStatus(id, status) {
        const orderId = +id;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        return this.ordersService.updateStatus(orderId, status);
    }
    pay(id, body, req) {
        const user = req.user;
        const orderId = +id;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        return this.ordersService.payOrder(orderId, user, body);
    }
    addItem(id, dto) {
        const orderId = +id;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        return this.ordersService.addItem(orderId, dto.productId, dto.quantity);
    }
    editItem(id, itemId, quantity) {
        const orderId = +id;
        const orderItemId = +itemId;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        if (isNaN(orderItemId))
            throw new common_1.BadRequestException('Invalid item ID');
        return this.ordersService.updateItemQuantity(orderId, orderItemId, quantity);
    }
    removeItem(id, itemId) {
        const orderId = +id;
        const orderItemId = +itemId;
        if (isNaN(orderId))
            throw new common_1.BadRequestException('Invalid order ID');
        if (isNaN(orderItemId))
            throw new common_1.BadRequestException('Invalid item ID');
        return this.ordersService.removeItem(orderId, orderItemId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-table/:tableId'),
    __param(0, (0, common_1.Param)('tableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findByTable", null);
__decorate([
    (0, common_1.Get)('history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "historyOne", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "pay", null);
__decorate([
    (0, common_1.Post)(':id/add-item'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_item_dto_1.AddItemDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "addItem", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(':id/item/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "editItem", null);
__decorate([
    (0, common_1.Patch)(':id/remove-item/:itemId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "removeItem", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map