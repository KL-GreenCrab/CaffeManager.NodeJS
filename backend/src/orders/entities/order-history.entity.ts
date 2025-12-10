import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('order_history')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  tableId: number;

  @Column({ nullable: true })
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('longtext')
  itemsJson: string;

  @CreateDateColumn()
  paidAt: Date;
}
