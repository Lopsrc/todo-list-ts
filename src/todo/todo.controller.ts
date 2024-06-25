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

@Controller('api/todos')
export class TodoController {
    constructor(
        private todoService: TodoService,
    ){}

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

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getAllTodos(@Req() req: Request, @Res() res: Response){
        this.todoService.getAllTodos(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @Get('todo')
    getTodo(@Req() req: Request, @Res() res: Response){
        this.todoService.getTodos(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

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

    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Put('pos')
    updatePositionOfTodo(@Body() todo: ChangeTodoPositionDTO, @Req() req: Request, @Res() res: Response){
        this.todoService.updatePositionOfTodo(req.user['sub'], todo)
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    @Delete()
    deleteTodo(@Req() req: Request, @Body() todo: DeleteTodoDTO, @Res() res: Response){
        this.todoService.deleteTodo(req.user['sub'], todo.id)
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
}
