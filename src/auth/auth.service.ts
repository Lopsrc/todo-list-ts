import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    logger: Logger;
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ){
        this.logger = new Logger(AuthService.name);
    }

    async signUp(user: CreateUserDTO){
        try {
            this.logger.log('Sign up.');
            const userExist = await this.usersService.getUserByEmail(user.email)
            if (userExist){
                throw new BadRequestException('User already exists');
            }
            
            const hash = await argon2.hash(user.password);
    
            const newUser = await this.usersService.createUser({
                name: user.name || null,
                email: user.email,
                pass_hash: hash,
                role: user.role || null,
                birth_date: new Date(user.birthDate) || null,
            });
    
            const tokens = await this.generateTokens(newUser.id, newUser.email, user.role);
            const refreshHash = await argon2.hash(tokens.refreshToken);
            this.logger.debug(`Sign up with email: ${newUser.email}, role: ${newUser.role}`);
            await this.usersService.updateTokenOfUser(newUser.id, refreshHash);
            return tokens;
        } catch (error) {
            this.logger.error(error.message);
            if( error.code === '23505'){
                throw new BadRequestException('todo is already exist');
            } else if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
    }

    async signIn(authDto: AuthDto){
        try {
            this.logger.log('Sign in.');
            // Check if user already exists. If is not found, retrurn error.
            const user = await this.usersService.getUserByEmail(authDto.email)
            if (!user || user.del){
                throw new BadRequestException('User does not exist');
            }
            // Compare passwords(request and db).
            const passwordMatches = await argon2.verify(user.pass_hash, authDto.password);
            if (!passwordMatches){
                throw new BadRequestException('Password is incorrect');
            }
            // Create pair of tokens.
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            // Store refresh token.
            const hashedRefreshToken = await argon2.hash(tokens.refreshToken);

            await this.usersService.updateTokenOfUser( user.id, hashedRefreshToken);
            // Return pair of tokens.
            return tokens;
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

    async logOut(id: number){
        try {
            this.logger.log('Log out');
            await this.usersService.getUserById(id);
            
            await this.usersService.updateUser(id,{refresh_token_hash: null });
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

    async refresh(id: number, token: string){
        try {
            this.logger.log('Refresh tokens');
            // Get a user by id.
            const user = await this.usersService.getUserById(id)
            // Compare hashes of tokens.
            const tokenMatches = await argon2.verify(user.refresh_token_hash, token);
            if (!tokenMatches){
                throw new BadRequestException('Token is not valid');
            }
            // Create pair of tokens.
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            // Store refresh token.
            const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
            await this.usersService.updateUser(user.id, {
                refresh_token_hash: hashedRefreshToken
            });
            // Return pair of tokens.
            return tokens;
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

    private async generateTokens(userId: number, email: string, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role,
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.ACCESS_TOKEN_TTL,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: process.env.REFRESH_TOKEN_TTL,
                },
            ),
        ]);
    
        return {
            accessToken,
            refreshToken,
        };
    }
}
