import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Tokens } from "../src/auth/models/tokens.models";
import { PrismaService } from "../src/prisma/prisma.service";
import { User } from "../src/users/model/user.model";
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { AppModule } from "../src/app.module";
import * as request from 'supertest';
import { Role } from "../src/roles/role.enum";

describe('Auth e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let tokens: Tokens;
    let user: User;
    let userShape = {
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        age: expect.any(Number),
        pass_hash: expect.any(String),
        refresh_token_hash: expect.any(String),
        birth_date: expect.any(Date),
        role: expect.any(Role),
        del:expect.any(Boolean),
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);

        useContainer(app.select(AppModule), { fallbackOnErrors: true });
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

        await app.init();

        user = await prisma.users.create({
            data: {
                name: 'Owner1',
                email: 'test@example.com',
                pass_hash: 'some_hash'
            },
        });
    });

    describe('GET /api/users', () => {
        it('returns a list of users', async () => {
            // TODO: implement me
        });
    });
});