import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { RecoverUserDTO } from './dto/recoverUser.dto';
import { Request, Response } from 'express';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAll(req: Request, res: Response): void;
    get(req: Request, res: Response): void;
    update(req: Request, user: UpdateUserDTO, res: Response): void;
    delete(req: Request, res: Response): void;
    recover(user: RecoverUserDTO, res: Response): void;
}
