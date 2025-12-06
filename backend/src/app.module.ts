import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = {
          type: 'mysql' as const,
          host: config.get('DB_HOST') || 'localhost',
          port: +config.get<number>('DB_PORT') || 3306,
          username: config.get('DB_USERNAME') || 'root',
          password: config.get('DB_PASSWORD') || '',
          database: config.get('DB_DATABASE') || 'coffee_db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          retryAttempts: 10,
          retryDelay: 3000,
          keepConnectionAlive: true,
        };
        return dbConfig;
      },
    }),

    UsersModule,
    AuthModule,
    ProductsModule,
    TablesModule,
    OrdersModule,
  ],
})
export class AppModule {}
