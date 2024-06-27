import { ApiProperty } from "@nestjs/swagger";

export class Tokens {
    @ApiProperty({example: 'access_token', description: 'access token(JWT)'})
    accessToken: string;
    @ApiProperty({example: 'refresh_token', description: 'refresh token'})
    refreshToken: string;
};