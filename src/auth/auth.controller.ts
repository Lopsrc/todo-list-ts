import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tokens } from './models/tokens.models'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}
    
    @ApiOperation({summary: 'sign up'})
    @ApiResponse({status: HttpStatus.OK, type: Tokens})
    @UsePipes(ValidationPipe)
    @Post('/signup')
    async signup(@Body() user: CreateUserDTO, @Res() res: Response) {
        await this.authService.signUp(user)
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'sign in'})
    @ApiResponse({status: HttpStatus.OK, type: Tokens})
    @UsePipes(ValidationPipe)
    @Post('/signin')
    async signin(@Body() authDto: AuthDto, @Res() res: Response) {
        this.authService.signIn(authDto)
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'log out'})
    @ApiResponse({status: HttpStatus.OK, type: 'true'})
    @UseGuards(AccessTokenGuard)
    @UsePipes(ValidationPipe)
    @Post("/logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        this.authService.logOut(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({data: true}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @ApiOperation({summary: 'refresh'})
    @ApiResponse({status: HttpStatus.OK, type: Tokens})
    @UseGuards(RefreshTokenGuard)
    @UsePipes(ValidationPipe)
    @Post("/refresh")
    async refresh(@Req() req: Request, @Res() res: Response){
        this.authService.refresh(req.user['sub'], req.user['refreshToken'])
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
}
