import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

const userArr = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        role: 'ADMIN',
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'secret',
        role: 'USER',
    }
]

const db = {
    users: {
        findMany: jest.fn().mockResolvedValue(userArr),
        findUnique: jest.fn().mockResolvedValue(userArr[0]),
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

  describe('getAllUsers', () => {

    it('should return all users', async () => {
      // arrange
        const users = await service.getAllUsers(0);
        expect(users).toEqual(userArr); 
    });
  });
});