import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @ApiProperty({example: 'Ivan@mail.com', description: 'email of the user'})
    @IsNotEmpty()
    @IsString()
    readonly email: string;
    
    @ApiProperty({example: 'some_password', description: 'password of the user'})
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}  