import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDTO{
    
    @ApiProperty({example: 'Ivan@mail.com', description: 'email of the user'})
    @IsNotEmpty()
    @IsString({message: "Incorrect token"})
    readonly accessToken: string;
    
    @ApiProperty({example: 'refresh_token', description: 'refresh token'})
    @IsNotEmpty()
    @IsString({message: "Incorrect token"})
    readonly refreshToken: string;
}