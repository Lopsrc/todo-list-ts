import { BadRequestException, Injectable, UnauthorizedException, ForbiddenException, InternalServerErrorException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './model/user.model';
import { RecoverUserDTO } from './dto/recoverUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { SessionDTO } from '../auth/dto/session.dto';

@Injectable()
export class UsersService {
    logger: Logger;
    constructor (
        private prisma: PrismaService
    ){
        this.logger = new Logger(UsersService.name);
    }

    async createUser(user: User){
        try {
            return await this.prisma.users.create({data:user})
        } catch (error) {
            if( error.code === '23505'){
                throw new BadRequestException('user is already exist');
            }
            
            throw error;
        }
    }

    async getAllUsers(id: number){
        try {
            this.logger.log('Get all users');
            const findUser = await this.getUserById(id)
            if (findUser.role !== 'ADMIN'){
                throw new ForbiddenException('access is denied');
            }
            this.logger.debug(`User with email: ${findUser.email} and role: ${findUser.role}`);
            const users = await this.prisma.users.findMany();
            if (users.length === 0){
                throw new BadRequestException('users are not found');
            }
            return users;
        } catch (error) {
            this.logger.error(error.message);
            if (
                error.status === HttpStatus.BAD_REQUEST  || 
                error.status === HttpStatus.UNAUTHORIZED ||
                error.status === HttpStatus.FORBIDDEN
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
    }

    async getUserByEmail(email: string) { 
        try{
            const user = await this.prisma.users.findUnique({ where: { email } });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number) {
        try {
            const user = await this.prisma.users.findUnique({ where: { id } });
            if (!user || user.del){
                throw new BadRequestException('user is not found');
            } else if (!user.refresh_token_hash){
                throw new UnauthorizedException('user is not authorized');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: number, user: UpdateUserDTO){ 
        try {
            this.logger.log('Update user');
            await this.getUserById(id);
    
            return await this.prisma.users.update({ 
                where: { id },
                data: user,
            });
        } catch (error) {
            this.logger.error(error.message);
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }

            throw new InternalServerErrorException('server error');
        }
    }

    async updateTokenOfUser(id: number, token: string){ 
        try {
            this.logger.log('Update token');    
            return await this.prisma.users.update({ 
                where: { id },
                data: {
                    refresh_token_hash: token
                },
            });
        } catch (error) {
            this.logger.error(error.message);
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }

            throw new InternalServerErrorException('server error');
        }
    }

    async deleteUser(id: number): Promise<Boolean>{
        try {
            this.logger.log('Delete user');
            await this.getUserById(id);
    
            await this.prisma.users.update({
                where: {id},
                data: {del: true, refresh_token_hash: null},
            });
            return true;
        } catch (error) {
            this.logger.error(error.message);
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }

            throw new InternalServerErrorException('server error');
        }
    }

    async recoverUser(user: RecoverUserDTO): Promise<Boolean>{
        try {
            this.logger.log('Recover user');
            const findUser = await this.getUserByEmail(user.email);
            if (!findUser){
                throw new BadRequestException('user is not found');
            }
            
            await this.prisma.users.update({
                where: { id: findUser.id },
                data: {del: false, refresh_token_hash: null},
            });
            return true;
        } catch(error) {
            this.logger.error(error.message);
            if (error.status === HttpStatus.BAD_REQUEST){
                throw error;
            }

            throw new InternalServerErrorException('server error');
        }
    }
}
