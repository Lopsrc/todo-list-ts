import { Body, Controller, Delete, Get, HttpStatus, Param, Put, Res, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { RecoverUserDTO } from './dto/recoverUser.dto';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from 'src/roles/role.guard';

@Controller('api/users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    getAll(@Req() req: Request, @Res() res: Response){
        this.usersService.getAllUsers(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({statusCode: HttpStatus.OK, data:result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @UsePipes(ValidationPipe)
    @Get('user')
    get(@Req() req: Request, @Res() res: Response): void{
        this.usersService.getUserById(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({status: HttpStatus.OK, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @UsePipes(ValidationPipe)
    @Put()
    update(@Req() req: Request, @Body() user: UpdateUserDTO,@Res() res: Response){
        this.usersService.updateUser(req.user['sub'], user)
        .then(result => res.status(HttpStatus.CREATED).send({status: HttpStatus.CREATED, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @UsePipes(ValidationPipe)
    @Delete()
    delete(@Req() req: Request, @Res() res: Response){
        this.usersService.deleteUser(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({status: HttpStatus.OK, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
    
    @UsePipes(ValidationPipe)
    @Put('rec')
    recover(@Body() user: RecoverUserDTO, @Res() res: Response){
        this.usersService.recoverUser(user)
        .then(result => res.status(HttpStatus.CREATED).send({status: HttpStatus.CREATED, data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
}