import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(req: any, body: CreateUserDto): Promise<import("./entities/user.entity").User>;
    getOne(id: string): Promise<import("./entities/user.entity").User>;
    updateUser(req: any, id: string, body: any): Promise<import("./entities/user.entity").User>;
    deleteUser(req: any, id: string): Promise<import("./entities/user.entity").User>;
}
