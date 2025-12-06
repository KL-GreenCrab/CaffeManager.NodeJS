"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userRepo, roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }
    async create(username, password, fullName, roleName) {
        if (!username || !password) {
            throw new common_1.BadRequestException('username and password are required');
        }
        const existing = await this.findByUsername(username);
        if (existing)
            throw new common_1.BadRequestException('username already exists');
        const hash = await bcrypt.hash(password, 10);
        let role = null;
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
    findByUsername(username) {
        return this.userRepo.findOne({ where: { username } });
    }
    findById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
    async validateUser(username, pass) {
        const user = await this.findByUsername(username);
        if (!user)
            return null;
        const matched = await bcrypt.compare(pass, user.password);
        if (matched) {
            const _a = user, { password } = _a, result = __rest(_a, ["password"]);
            return result;
        }
        return null;
    }
    async update(id, data) {
        const user = await this.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (data.fullName !== undefined)
            user.fullName = data.fullName;
        if (data.password !== undefined)
            user.password = await bcrypt.hash(data.password, 10);
        return this.userRepo.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.userRepo.remove(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map