import { BadRequestException, HttpStatus, ForbiddenException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { ChangeTodoPositionDTO } from './dto/changePosition.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodoService {
    logger: Logger;
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
    ){
        this.logger = new Logger(TodoService.name);
    }

    async createTodo(user_id: number, todo: CreateTodoDTO){
        try {
            this.logger.log('Create todo');
            // find user from DB. if !refresh_hash || del = true || !user || role != ADMIN  thrown exception.
            await this.userService.getUserById(user_id);
            this.logger.debug(`Validation the user by user_id = ${user_id}` );
            // find a record from DB, where position = the biggest value.
            let position = await this.getMaxPosition(user_id) + 1;
            this.logger.debug(`Calculate a position. Position = ${position}` );
            // create a new record in DB, with position = the biggest value + 1.
            this.logger.log('Creating todo...');
            return await this.prisma.projects.create({data: {
                name: todo.name,
                description: todo.description,
                created_at: new Date(),
                position: position,
                progress_id: todo.progress_id,
                user_id: user_id,
            }})
        } catch (error) {
            this.logger.error(error.message);
            if( error.code === '23505'){
                throw new BadRequestException('todo is already exist');
            } else if (
                error.status === HttpStatus.BAD_REQUEST || 
                error.status === HttpStatus.UNAUTHORIZED
            ){
                throw error;
            }
            throw new InternalServerErrorException('server error');
        }
    }

    async getAllTodos(user_id: number){
        try {
            this.logger.log(`Get all todos. Admin with user_id: ${user_id}`);
            // find user from DB. if !refresh_hash || del = true || !user || role != ADMIN  thrown exception.
            const user = await this.userService.getUserById(user_id);
            if (user.role !== 'ADMIN'){
                throw new ForbiddenException('access denied');
            }
            this.logger.debug('getting todos...');            
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
            this.logger.error('Get all todos: ', error.message);
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
            this.logger.log('Get all todos for user.');
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // get all todo, projects left join progress sorting by position
            this.logger.debug('getting all todos...');
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
            this.logger.error(error.message);
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
            this.logger.log('Update todo by user_id and id');
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // update record from db.
            this.logger.debug('updating todo...');
            return await this.prisma.projects.update({
                where: { 
                    id: todo.id,
                    user_id: user_id,
                },
                data: todo,
            })
        } catch (error) {
            this.logger.error(error.message);
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
            this.logger.log('Update a position of todo');
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // find record from progress where position is bigger.        
            const min = (todo.oldPosition > todo.newPosition) ? todo.newPosition : todo.oldPosition;
            const max = (todo.oldPosition < todo.newPosition) ? todo.newPosition : todo.oldPosition;
            
            let todos = await this.getTodosByPosition(user_id, min, max);
            if (todo.oldPosition > todo.newPosition){
                for (let i = 0; i < todos.length - 1; i++){
                    [todos[i].position, todos[i+1].position] = [todos[i+1].position, todos[i].position];
                }
            } else {
                for (let i = todos.length - 1; i >= 1; i--){
                    [todos[i].position, todos[i-1].position] = [todos[i-1].position, todos[i].position];
                }
            }
            this.logger.debug(`Got positons, number of todos= ${todos.length}`);
            
            await this.prisma.$transaction(async (tx) => {
                for (let i = 0; i < todos.length; i++){
                    this.logger.debug(`Changing positions: ${todos[i].name, todos[i].position}`);
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
            this.logger.error(error.message);
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
            this.logger.log('Delete the todo');
            // find user from DB. if !refresh_hash || del = true || !user  thrown exception.
            await this.userService.getUserById(user_id);
            // delete record.
            const todo = await this.prisma.projects.findFirst({
                where: { id },
            })
            if (!todo) {
                throw new BadRequestException('todo is not exist');
            }
            this.logger.debug(`Got todo with id and position: ${todo.id} and ${todo.position}`);
            const lastPosition = await this.getMaxPosition(user_id);
            if (!lastPosition) {
                throw new BadRequestException('todo is not deleted');
            }   
            this.logger.debug(`Got todo(last) with id and position: ${todo.id} and ${todo.position}`);

            const todos = await this.getTodosByPosition(user_id, todo.position+1, lastPosition);
            this.logger.debug(`Got todos: number of todos = ${todos.length}`);


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
            return true;
        } catch (error){
            this.logger.error(error.message);
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

    private async getTodosByPosition(user_id: number, minPosition: number, maxPosition: number){
        try {
            this.logger.debug('Get todos by position.')
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
            this.logger.debug('Get max position');
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
