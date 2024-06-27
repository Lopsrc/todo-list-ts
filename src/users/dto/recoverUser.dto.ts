import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RecoverUserDTO{
    @ApiProperty({example: 'Ivan2000@example.com', description: 'email of the user'})
    @IsString()
    @IsEmail()
    readonly email: string;
    
    @ApiProperty({example: 'example_password', description: 'password of the user'})
    @IsString()
    readonly password: string;
}