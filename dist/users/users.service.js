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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(user) {
        return await this.prisma.users.create({ data: user });
    }
    async getAllUsers(id) {
        const findUser = await this.getUserById(id);
        if (!findUser || findUser.del) {
            throw new common_1.BadRequestException('users are not found');
        }
        else if (!findUser.refresh_token_hash) {
            throw new common_1.UnauthorizedException('user is not authorized');
        }
        else if (findUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('access is denied');
        }
        const users = await this.prisma.users.findMany();
        if (users.length === 0) {
            throw new common_1.BadRequestException('users are not found');
        }
        return users;
    }
    async getUserByEmail(email) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        return user;
    }
    async getUserById(id) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user || user.del) {
            throw new common_1.BadRequestException('user is not found');
        }
        else if (!user.refresh_token_hash) {
            throw new common_1.UnauthorizedException('user is not authorized');
        }
        return user;
    }
    async updateUser(id, user) {
        const findUser = await this.getUserById(id);
        if (!findUser || findUser.del) {
            throw new common_1.BadRequestException('user is not found');
        }
        else if (!findUser.refresh_token_hash) {
            throw new common_1.UnauthorizedException('user is not authorized');
        }
        return await this.prisma.users.update({
            where: { id },
            data: user,
        });
    }
    async signIn(user) {
        const findUser = await this.getUserByEmail(user.email);
        if (!findUser || findUser.del) {
            throw new common_1.BadRequestException('user is not found');
        }
        return await this.prisma.users.update({
            where: { id: findUser.id },
            data: user,
        });
    }
    async logOut(user) {
        const findUser = await this.getUserById(user.id);
        if (!findUser || findUser.del) {
            throw new common_1.BadRequestException('user is not found');
        }
        return await this.prisma.users.update({
            where: { id: user.id },
            data: user,
        });
    }
    async deleteUser(id) {
        const findUser = await this.getUserById(id);
        if (!findUser || findUser.del) {
            throw new common_1.BadRequestException('user is not found');
        }
        await this.prisma.users.update({
            where: { id },
            data: { del: true, refresh_token_hash: null },
        });
    }
    async recoverUser(user) {
        const findUser = await this.getUserByEmail(user.email);
        if (!findUser) {
            throw new common_1.BadRequestException('user is not found');
        }
        await this.prisma.users.update({
            where: { id: findUser.id },
            data: { del: false, refresh_token_hash: null },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map