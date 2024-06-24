import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './model/user.model';
import { RecoverUserDTO } from './dto/recoverUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { SessionDTO } from 'src/auth/dto/session.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(user: User): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    getAllUsers(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }[]>;
    getUserByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    updateUser(id: number, user: UpdateUserDTO): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    signIn(user: SessionDTO): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    logOut(user: SessionDTO): Promise<{
        id: number;
        name: string;
        email: string;
        pass_hash: string;
        refresh_token_hash: string;
        birth_date: Date;
        role: string;
        del: boolean;
    }>;
    deleteUser(id: number): Promise<void>;
    recoverUser(user: RecoverUserDTO): Promise<void>;
}
