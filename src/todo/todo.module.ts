import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [
    UsersModule,
    PrismaModule
  ]
})
export class TodoModule {}
