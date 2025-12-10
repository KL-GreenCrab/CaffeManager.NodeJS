import { Controller,Put, Post, Body, Get, Param, Patch, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req: any) {
    const user = req.user;
    return this.ordersService.create(dto, user);
  }

  @Get()
  findAll() { return this.ordersService.findAll(); }

  @Get('by-table/:tableId')
  findByTable(@Param('tableId') tableId: string) {
    const id = +tableId;
    if (isNaN(id)) throw new BadRequestException('Invalid table ID');
    return this.ordersService.findByTable(+tableId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const orderId = +id;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    return this.ordersService.findOne(orderId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const orderId = +id;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    return this.ordersService.updateStatus(orderId, status);
  }

  @Post(':id/pay')
  @UseGuards(AuthGuard('jwt'))
  pay(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const user = req.user;
    const orderId = +id;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    return this.ordersService.payOrder(orderId, user, body);
  }

  @Post(':id/add-item')
  addItem(@Param('id') id: string, @Body() dto: AddItemDto) {
    const orderId = +id;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    return this.ordersService.addItem(orderId, dto.productId, dto.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/item/:itemId')
  editItem(@Param('id') id: string, @Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    const orderId = +id;
    const orderItemId = +itemId;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    if (isNaN(orderItemId)) throw new BadRequestException('Invalid item ID');
    return this.ordersService.updateItemQuantity(orderId, orderItemId, quantity);
  }

  @Patch(':id/remove-item/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    const orderId = +id;
    const orderItemId = +itemId;
    if (isNaN(orderId)) throw new BadRequestException('Invalid order ID');
    if (isNaN(orderItemId)) throw new BadRequestException('Invalid item ID');
    return this.ordersService.removeItem(orderId, orderItemId);
  }
}