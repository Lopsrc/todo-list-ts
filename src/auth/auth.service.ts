import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ){}

    async signUp(user: CreateUserDTO){
        
        const userExist = await this.usersService.getUserByEmail(user.email)
        // console.log(user.email)
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
        await this.usersService.signIn({
            email: newUser.email,
            refresh_token_hash: refreshHash
        });
        return tokens;
    }

    async signIn(authDto: AuthDto){
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
        console.log(user.email)
        await this.usersService.signIn(
            {email: user.email,
            refresh_token_hash: hashedRefreshToken}
        );
        // Return pair of tokens.
        return tokens;
    }

    async logOut(id: number){
        return this.usersService.logOut({id,refresh_token_hash: null });
    }

    async refresh(id: number, token: string){
        // Get a user by id.
        const user = await this.usersService.getUserById(id)
        if (!user || user.del){
            throw new BadRequestException('User does not exist');
        }
        // Compare hashes of tokens.
        const tokenMatches = await argon2.verify(user.refresh_token_hash, token);
        if (!tokenMatches){
            throw new BadRequestException('Token is not valid');
        }
        // Create pair of tokens.
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        // Store refresh token.
        const hashedRefreshToken = await argon2.hash(tokens.refreshToken);
        await this.usersService.signIn({
            email: user.email,
            refresh_token_hash: hashedRefreshToken
        });
        // Return pair of tokens.
        return tokens;
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
