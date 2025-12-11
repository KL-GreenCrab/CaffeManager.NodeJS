import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private repo;
    private roleRepo;
    constructor(repo: Repository<User>, roleRepo: Repository<Role>);
    create(username: string, pass: string, fullName: string, roleName: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(username: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    findById(id: number): Promise<User>;
    validateUser(username: string, pass: string): Promise<any>;
    update(id: number, attrs: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
}
