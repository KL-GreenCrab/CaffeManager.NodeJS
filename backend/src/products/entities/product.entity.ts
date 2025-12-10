import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ProductType {
  COFFEE = 'coffee',
  TEA = 'tea',
  SMOOTHIE = 'smoothie',
  SODA = 'soda',
  JUICE = 'juice',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.COFFEE })
  type: ProductType;
}
