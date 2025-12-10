import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) { return this.ordersService.findOne(+id); }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Post(':id/pay')
  @UseGuards(AuthGuard('jwt'))
  pay(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const user = req.user;
    return this.ordersService.payOrder(+id, user, body);
  }

  @Post(':id/add-item')
  addItem(@Param('id') id: string, @Body() dto: AddItemDto) {
    return this.ordersService.addItem(+id, dto.productId, dto.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/item/:itemId')
  editItem(@Param('id') id: string, @Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    return this.ordersService.updateItemQuantity(+id, +itemId, quantity);
  }

  @Get('history')
  history() { return this.ordersService.listOrderHistory(); }

  @Get('history/:id')
  historyOne(@Param('id') id: string) { return this.ordersService.getOrderHistory(+id); }

  @Patch(':id/remove-item/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.ordersService.removeItem(+id, +itemId);
  }
}
