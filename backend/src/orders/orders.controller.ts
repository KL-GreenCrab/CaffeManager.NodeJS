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

  @Post(':id/add-item')
  addItem(@Param('id') id: string, @Body() dto: AddItemDto) {
    return this.ordersService.addItem(+id, dto.productId, dto.quantity);
  }

  @Patch(':id/remove-item/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.ordersService.removeItem(+id, +itemId);
  }
}
