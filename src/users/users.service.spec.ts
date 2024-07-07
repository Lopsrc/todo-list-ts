import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

const userArr = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        refresh_token_hash: 'some_token',
        password: 'secret',
        role: 'ADMIN',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        refresh_token_hash: 'some_token',
        password: 'secret',
        role: 'USER',
    }
]

const db = {
    users: {
        findMany: jest.fn().mockResolvedValue(userArr),
        findUnique: jest.fn().mockResolvedValue( userArr[0]),
        findFirst: jest.fn().mockResolvedValue(userArr[0]),
        create: jest.fn().mockReturnValue(userArr[0]),
        save: jest.fn(),
        update: jest.fn().mockResolvedValue(userArr[0]),
        delete: jest.fn().mockResolvedValue(userArr[0]),
    },
};

describe('UsersService', () => {
    // let usersController: UsersController;
    let service: UsersService;
    let prisma: PrismaService;

    beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: db,
                },
                ],
            }).compile();
        
            service = module.get<UsersService>(UsersService);
            prisma = module.get<PrismaService>(PrismaService);
        
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUser = await service.createUser({
                name: userArr[0].name,
                email: userArr[0].email,
                pass_hash: 'some pass hash',
                role: userArr[0].role,
            });
            expect(newUser).toEqual(userArr[0]); 
        });
    });

    describe('getAllUsers', () => {

        it('should return all users', async () => {
            const users = await service.getAllUsers(0);
            expect(users).toEqual(userArr); 
        });
    });
    
    describe('getUserByEmail', () => {
        it('should return a user by email', async () => {
            const user = await service.getUserByEmail('john.doe@example.com');
            expect(user).toEqual(userArr[0]); 
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user = await service.getUserById(1);
            expect(user).toEqual(userArr[0]); 
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const updatedUser = await service.updateUser(1, {
                name: 'John Doe Updated',
                role: 'ADMIN',
                birthDate: '2002-04-04'
            });
            expect(updatedUser).toEqual(userArr[0]); 
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const deletedUser = await service.deleteUser(1);
            expect(deletedUser).toBeTruthy(); 
        });
    });

    describe('recoverUser', () => {
        it('should recover a user', async () => {
            const recoveredUser = await service.recoverUser({
                email: 'john.doe@example.com',
                password: 'newpassword',
            });
            expect(recoveredUser).toBeTruthy(); 
        });
    });
});