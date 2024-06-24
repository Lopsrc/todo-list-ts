import { Module } from "@nestjs/common";

import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from './prisma/prisma.module';


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        UsersModule,
        AuthModule,
        // PrismaModule,
        
    ],
})
export class AppModule{}