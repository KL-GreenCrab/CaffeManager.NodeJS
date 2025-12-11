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
const bcrypt = require("bcrypt");
const role_entity_1 = require("../roles/entities/role.entity");
let UsersService = class UsersService {
    constructor(repo, roleRepo) {
        this.repo = repo;
        this.roleRepo = roleRepo;
    }
    async create(username, pass, fullName, roleName) {
        const password = await bcrypt.hash(pass, 10);
        const role = await this.roleRepo.findOne({ where: { name: roleName } });
        if (!role) {
            throw new common_1.NotFoundException(`Role ${roleName} not found`);
        }
        const user = this.repo.create({ username, password, fullName, role });
        return this.repo.save(user);
    }
    findAll() {
        return this.repo.find({ relations: ['role'] });
    }
    findOne(username) {
        return this.repo.findOne({ where: { username }, relations: ['role'] });
    }
    findByUsername(username) {
        return this.repo.findOne({ where: { username } });
    }
    findById(id) {
        return this.repo.findOne({ where: { id } });
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
    async update(id, attrs) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (attrs.password) {
            attrs.password = await bcrypt.hash(attrs.password, 10);
        }
        if (attrs.roleId) {
            const role = await this.roleRepo.findOne({ where: { id: attrs.roleId } });
            if (!role) {
                throw new common_1.NotFoundException(`Role with ID ${attrs.roleId} not found`);
            }
            user.role = role;
            delete attrs.roleId;
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.repo.remove(user);
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