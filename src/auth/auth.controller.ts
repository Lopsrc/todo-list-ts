import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}
    
    @UsePipes(ValidationPipe)
    @Post('/signup')
    async signup(@Body() user: CreateUserDTO, @Res() res: Response) {
        await this.authService.signUp(user)
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UsePipes(ValidationPipe)
    @Post('/signin')
    async signin(@Body() authDto: AuthDto, @Res() res: Response) {
        this.authService.signIn(authDto)
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(AccessTokenGuard)
    @UsePipes(ValidationPipe)
    @Post("/logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        this.authService.logOut(req.user['sub'])
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }

    @UseGuards(RefreshTokenGuard)
    @UsePipes(ValidationPipe)
    @Post("/refresh")
    async refresh(@Req() req: Request, @Res() res: Response){
        this.authService.refresh(req.user['sub'], req.user['refreshToken'])
        .then(result => res.status(HttpStatus.OK).send({data: result}))
        .catch(error => res.status(error.status).send({statusCode: error.status, error: error.message}));
    }
}
