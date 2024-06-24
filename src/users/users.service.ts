import { BadRequestException, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './model/user.model';
import { RecoverUserDTO } from './dto/recoverUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { SessionDTO } from 'src/auth/dto/session.dto';

@Injectable()
export class UsersService {

    constructor (
        private prisma: PrismaService
    ){}

    async createUser(user: User){
        return await this.prisma.users.create({data:user})
    }

    async getAllUsers(id: number){
        const findUser = await this.getUserById(id)
        if (!findUser || findUser.del){
            throw new BadRequestException('users are not found');
        } else if (!findUser.refresh_token_hash){
            throw new UnauthorizedException('user is not authorized');
        } else if (findUser.role !== 'ADMIN'){
            throw new ForbiddenException('access is denied');
        }
        const users = await this.prisma.users.findMany();
        if (users.length === 0){
            throw new BadRequestException('users are not found');
        }
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        return user;
    }

    async getUserById(id: number) {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user || user.del){
            throw new BadRequestException('user is not found');
        } else if (!user.refresh_token_hash){
            throw new UnauthorizedException('user is not authorized');
        }
        return user;
    }

    async updateUser(id: number, user: UpdateUserDTO){ 
        const findUser = await this.getUserById(id);
        if (!findUser || findUser.del ){
            throw new BadRequestException('user is not found');
        } else if (!findUser.refresh_token_hash){
            throw new UnauthorizedException('user is not authorized');
        }

        return await this.prisma.users.update({ 
            where: { id },
            data: user,
        });
    }

    async signIn(user: SessionDTO){
        const findUser = await this.getUserByEmail(user.email);
        if (!findUser || findUser.del ){
            throw new BadRequestException('user is not found');
        } 
        
        return await this.prisma.users.update({ 
            where: { id: findUser.id },
            data: user,
        });
    }

    async logOut(user: SessionDTO){
        const findUser = await this.getUserById(user.id);
        if (!findUser || findUser.del ){
            throw new BadRequestException('user is not found');
        } 
        
        return await this.prisma.users.update({ 
            where: { id: user.id},
            data: user,
        });
    }

    async deleteUser(id: number){
        const findUser = await this.getUserById(id);
        if (!findUser || findUser.del){
            throw new BadRequestException('user is not found');
        }
        await this.prisma.users.update({
            where: {id},
            data: {del: true, refresh_token_hash: null},
        });
    }

    async recoverUser(user: RecoverUserDTO){
        
        const findUser = await this.getUserByEmail(user.email);
        if (!findUser){
            throw new BadRequestException('user is not found');
        }
        
        await this.prisma.users.update({
            where: { id: findUser.id },
            data: {del: false, refresh_token_hash: null},
        });
    }
}
