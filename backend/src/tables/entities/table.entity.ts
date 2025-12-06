import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum TableStatus { EMPTY = 'EMPTY', OCCUPIED = 'OCCUPIED', RESERVED = 'RESERVED' }

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.EMPTY })
  status: TableStatus;

  @OneToMany(() => Order, order => order.table)
  orders: Order[];
}
