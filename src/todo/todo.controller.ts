import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { ChangeTodoPositionDTO } from './dto/changePosition.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Todo } from './model/todo.model';

@ApiTags('Todos')
@Controller('api/todos')
export class TodoController {
    constructor(
        private todoService: TodoService,
    ){}

    @ApiOperation({summary: 'create a todo'})
    @ApiResponse({status: HttpStatus.OK, type: Todo})
    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Post()
    createTodo(@Body() todo: CreateTodoDTO, @Req() req: Request, @Res() res: Response){
        this.todoService.createTodo(req.user['sub'], todo)
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'get all todos'})
    @ApiResponse({status: HttpStatus.OK, type: [Todo]})
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getAllTodos(@Req() req: Request, @Res() res: Response){
        this.todoService.getAllTodos(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'get all todos by user_id'})
    @ApiResponse({status: HttpStatus.OK, type: [Todo]})
    @UseGuards(AccessTokenGuard)
    @Get('todo')
    getTodo(@Req() req: Request, @Res() res: Response){
        this.todoService.getTodos(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'update a todo'})
    @ApiResponse({status: HttpStatus.OK, type: Todo})
    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Put()
    updateTodo(@Body() todo: UpdateTodoDTO, @Req() req: Request, @Res() res: Response){
        this.todoService.updateTodo(req.user['sub'], todo)
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'update a position of the todo'})
    @ApiResponse({status: HttpStatus.OK, type: [Todo]})
    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Put('position')
    updatePositionOfTodo(@Body() todo: ChangeTodoPositionDTO, @Req() req: Request, @Res() res: Response){
        this.todoService.updatePositionOfTodo(req.user['sub'], todo)
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'delete the todo'})
    @ApiResponse({status: HttpStatus.OK, type: 'true'})
    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Delete()
    deleteTodo(@Req() req: Request, @Body() todo: DeleteTodoDTO, @Res() res: Response){
        this.todoService.deleteTodo(req.user['sub'], todo.id)
        .then(() => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data: true}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
}
