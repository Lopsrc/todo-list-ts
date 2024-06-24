import { Response, Request } from 'express';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(user: CreateUserDTO, res: Response): Promise<void>;
    signin(authDto: AuthDto, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
}
