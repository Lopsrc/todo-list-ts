import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({}),
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`
		}),
	],
	providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
