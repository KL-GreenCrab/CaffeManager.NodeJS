import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderHistory } from './entities/order-history.entity';
import { Product } from '../products/entities/product.entity';
import { TableEntity } from '../tables/entities/table.entity';
import { TableHistory } from '../tables/entities/table-history.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, OrderHistory, Product, TableEntity, TableHistory]), UsersModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
