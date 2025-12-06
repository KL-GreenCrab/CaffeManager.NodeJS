import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
export declare class UsersService {
    private userRepo;
    private roleRepo;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>);
    create(username: string, password: string, fullName?: string, roleName?: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    findById(id: number): Promise<User>;
    validateUser(username: string, pass: string): Promise<any>;
    update(id: number, data: any): Promise<User>;
    remove(id: number): Promise<User>;
}
