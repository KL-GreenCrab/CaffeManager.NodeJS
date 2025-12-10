import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('table_history')
export class TableHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('longtext')
  ordersJson: string;

  @CreateDateColumn()
  closedAt: Date;
}
