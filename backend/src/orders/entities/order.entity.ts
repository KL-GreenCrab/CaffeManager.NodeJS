import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { TableEntity } from '../../tables/entities/table.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus { NEW = 'NEW', PREPARING = 'PREPARING', SERVING = 'SERVING', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TableEntity, table => table.orders, { eager: true })
  table: TableEntity;

  @ManyToOne(() => User, user => user.orders, { eager: true, nullable: true })
  user: User;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
