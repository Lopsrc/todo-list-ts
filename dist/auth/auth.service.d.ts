import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signUp(user: CreateUserDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signIn(authDto: AuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logOut(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    refresh(id: number, token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
