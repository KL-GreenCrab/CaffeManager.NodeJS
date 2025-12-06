import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  /**
   * Create a user. If roleName provided, will assign that role (create role if missing).
   * This method is used by admin only (controller enforces that).
   */
  async create(username: string, password: string, fullName?: string, roleName?: string) {
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const existing = await this.findByUsername(username);
    if (existing) throw new BadRequestException('username already exists');

    const hash = await bcrypt.hash(password, 10);

    let role: Role = null;
    if (roleName) {
      role = await this.roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        role = this.roleRepo.create({ name: roleName });
        role = await this.roleRepo.save(role);
      }
    }

    const user = this.userRepo.create({ username, password: hash, fullName, role });
    return this.userRepo.save(user);
  }

  findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async validateUser(username: string, pass: string) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.password);
    if (matched) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async update(id: number, data: any) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (data.fullName !== undefined) user.fullName = data.fullName;
    if (data.password !== undefined) user.password = await bcrypt.hash(data.password, 10);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepo.remove(user);
  }
}
