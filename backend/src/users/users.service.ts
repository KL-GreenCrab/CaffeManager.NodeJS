import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(username: string, pass: string, fullName: string, roleName: string) {
    const password = await bcrypt.hash(pass, 10);
    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }
    const user = this.repo.create({ username, password, fullName, role });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({ relations: ['role'] });
  }

  findOne(username: string) {
    return this.repo.findOne({ where: { username }, relations: ['role'] });
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
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

  async update(id: number, attrs: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (attrs.password) {
        attrs.password = await bcrypt.hash(attrs.password, 10);
    }

    if (attrs.roleId) {
        const role = await this.roleRepo.findOne({ where: { id: attrs.roleId } });
        if (!role) {
            throw new NotFoundException(`Role with ID ${attrs.roleId} not found`);
        }
        user.role = role;
        // Don't pass roleId to the user object directly
        delete attrs.roleId;
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}