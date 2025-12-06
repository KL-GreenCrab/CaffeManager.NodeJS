import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @ManyToOne(() => Role, role => role.users, { eager: true, nullable: true })
  role: Role;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
