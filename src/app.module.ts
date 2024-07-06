import { Module } from "@nestjs/common";

import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TodoModule } from "./todo/todo.module";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        UsersModule,
        AuthModule,
        TodoModule,
        
    ],
})
export class AppModule{}