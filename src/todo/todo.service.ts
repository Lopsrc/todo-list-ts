import { BadRequestException, HttpStatus, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { ChangeTodoPositionDTO } from './dto/changePosition.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TodoService {

    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
    ){}

    async createTodo(user_id: number, todo: CreateTodoDTO){
        try {
            // find user from DB. if !refresh_hash || del = true || !user || role != ADMIN  thrown exception.
            await this.userService.getUserById(user_id);
            console.log("cteate");
            // find a record from DB, where position = the biggest value.
            let position = await this.getMaxPosition(user_id) + 1;
            // create a new record in DB, with position = the biggest value + 1.
            return await this.prisma.projects.create({data: {
                name: todo.name,
                description: todo.description,
                created_at: new Date(),
                position: position,
                progress_id: todo.progress_id,
                user_id: user_id,
            }})
        } catch (error) {
            if( error.code === '23505'){
                throw new BadRequestException('todo is already exist');
            }
            throw new InternalServerErrorException('server error');
        }
    }

    async getAllTodos(user_id: number){
        try {
            // find user from DB. if !refresh_hash || del = true || !user || role != ADMIN  thrown exception.
        const user = await this.userService.getUserById(user_id);
        if (user.role !== 'ADMIN'){
            throw new ForbiddenException('access denied');
        }
        // get all todo, users left join projects (projects left join progress) sorting by user_id
        const todos = await this.prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                created_at: true,
                position: true,
                progress: true,
                user: {
                    select: {
                        name: true,
                    }
                },
            },
            where: {
                user_id: user_id,
            },
            orderBy: {
                position: 'asc',
            }
        });
        if (!todos) {
            throw new BadRequestException('todos are not found');
        }

        return todos;
        } catch (error) {
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
        
    }

    async getTodos(user_id: number){
        try {
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // get all todo, projects left join progress sorting by position
            const todos = await this.prisma.projects.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    created_at: true,
                    position: true,
                    progress: true,
                },
                where: {
                    user_id: user_id,
                },
                orderBy: {
                    position: 'asc',
                },
            });
            if (!todos) {
                throw new BadRequestException('todos are nor found');
            }

        return todos;
        } catch (error) {
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
        
    }

    
    async updateTodo(user_id: number, todo: UpdateTodoDTO){
        try {
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // update record from db.
            await this.prisma.projects.update({
                where: { 
                    id: todo.id,
                    user_id: user_id,
                },
                data: todo,
            })
        } catch (error) {
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ) {
                throw error;
            }else if (error.code === 'P2025'){
                throw new BadRequestException('todo is not found');
            }
            throw new InternalServerErrorException('server error');
        }
    }

    async updatePositionOfTodo(user_id: number, todo: ChangeTodoPositionDTO){
        try{
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // find record from progress where position is bigger.        
            const min = (todo.oldPosition > todo.newPosition) ? todo.newPosition : todo.oldPosition;
            const max = (todo.oldPosition < todo.newPosition) ? todo.newPosition : todo.oldPosition;
            
            let todos = await this.getTodoByPosition(user_id, min, max);
            if (todo.oldPosition > todo.newPosition){
                for (let i = 0; i < todos.length - 1; i++){
                    [todos[i].position, todos[i+1].position] = [todos[i+1].position, todos[i].position];
                }
            } else {
                for (let i = todos.length - 1; i >= 1; i--){
                    [todos[i].position, todos[i-1].position] = [todos[i-1].position, todos[i].position];
                }
            }

            await this.prisma.$transaction(async (tx) => {
                for (let i = 0; i < todos.length; i++){
                    await tx.projects.update({
                        where: { id: todos[i].id },
                        data: {
                            position: todos[i].position,
                        }
                    })
                }
            })

            return todos;
        }catch (error){
            if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
    }


    async deleteTodo(user_id: number, id: number){
        try{
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // delete record.
            const todo = await this.prisma.projects.findFirst({
                where: { id },
            })
            if (!todo) {
                throw new BadRequestException('todo is not exist');
            }
            if (todo.user_id !== user_id) {
                throw new ForbiddenException('access denied');
            }

            const lastPosition = await this.getMaxPosition(user_id);
            if (!lastPosition) {
                throw new BadRequestException('todo is not deleted');
            }

            const todos = await this.getTodoByPosition(user_id, todo.position+1, lastPosition);


            await this.prisma.$transaction(async (tx) => {
                await tx.projects.deleteMany({
                    where: {
                        id: todo.id,
                    }
                })
                for (let i = 0; i < todos.length; i++){

                    await tx.projects.update({
                        where: {
                            id: todos[i].id,
                        },
                        data: {
                            position: {
                                decrement: 1,
                            }
                        }
                    })
                }
            });
        } catch (error){
            if (
                error.status === HttpStatus.BAD_REQUEST  || 
                error.status === HttpStatus.UNAUTHORIZED ||
                error.status === HttpStatus.FORBIDDEN
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }   
    }

    private async getTodoByPosition(user_id: number, minPosition: number, maxPosition: number){
        try {

            await this.userService.getUserById(user_id);
    
            let todo = await this.prisma.projects.findMany({
                where: {
                    user_id: user_id,
                    position: {
                        gte: minPosition,
                        lte: maxPosition,
                    },
                }
            });
            if (!todo) {
                throw new BadRequestException('todos are not found');
            }
    
            return todo;
        }catch (error) {
            throw error;
        }
    }


    private async getMaxPosition(user_id){
        try{
            const todo = await this.prisma.projects.findFirst({
                
                where: {
                    user_id: user_id,
                },
                orderBy: {
                    position: 'desc',
                }
            });
            if (!todo){
                return 0;
            }
            return todo.position;
        } catch(error){
            throw error;
        }
    } 


}
