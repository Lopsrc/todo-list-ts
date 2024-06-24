import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsDate, IsString, IsEmpty, IsOptional } from "class-validator";

export class CreateUserDTO{
    @IsNotEmpty()
    @IsEmail({}, {message: "Incorrect email"})
    readonly email: string;
    
    @IsOptional()
    @IsString({message: "Incorrect name"})
    readonly name: string;
    
    @IsNotEmpty()
    @IsString({message: "Incorrect password"})
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly role: string;

    @IsOptional()
    @IsString()
    readonly birthDate?: string;
}