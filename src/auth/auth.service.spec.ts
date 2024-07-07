import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

const tokens = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
}

const user = {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    refresh_token_hash: 'some_token',
    password: 'secret',
    role: 'ADMIN',
}

const db = {
	users: {
        findUnique: jest.fn().mockResolvedValue({ id: 1 , refresh_token_hash: 'some_token', role: 'ADMIN'}),
        findFirst: jest.fn().mockResolvedValue({ id: 1 , refresh_token_hash: 'some_token', role: 'ADMIN'}),
        create: jest.fn().mockReturnValue(user),
    },
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                PrismaService,
                
                // JwtService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue(tokens.accessToken),
                    },
                },
                {
					provide: PrismaService,
					useValue: db,
				},
            ],

        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('signUp', () => {
        it('should create a new user', () => {
            const tokens = service.signUp({
                email: 'test@test.com',
                password: 'password',
                role: 'USER',
            })
            expect(tokens).toBeTruthy();
        });
    });
    // TODO: implement me.
});
