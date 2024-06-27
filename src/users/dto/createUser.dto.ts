import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsDate, IsString, IsEmpty, IsOptional } from "class-validator";

export class CreateUserDTO{
    @ApiProperty({example: 'Ivan2000@example.com', description: 'email of the user'})
    @IsNotEmpty()
    @IsEmail({}, {message: "Incorrect email"})
    readonly email: string;
    
    @ApiProperty({example: 'Ivan', description: 'name of the user'})
    @IsOptional()
    @IsString({message: "Incorrect name"})
    readonly name: string;
    
    @ApiProperty({example: 'example_password', description: 'password of the user'})
    @IsNotEmpty()
    @IsString({message: "Incorrect password"})
    readonly password: string;

    @ApiProperty({example: 'USER', description: 'role of the user'})
    @IsNotEmpty()
    @IsString()
    readonly role: string;

    @ApiProperty({example: '2000-01-01', description: 'birthday of the user'})
    @IsOptional()
    @IsString()
    readonly birthDate?: string;
}