import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class RecoverUserDTO{
    @IsString()
    @IsEmail()
    readonly email: string;
    
    @IsString()
    readonly password: string;
}