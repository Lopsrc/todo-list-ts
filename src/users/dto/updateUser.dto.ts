import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO{

    @IsOptional()
    @IsString({message: "Incorrect name"})
    readonly name: string;
    
    @IsOptional()
    @IsString()
    readonly role: string;

    @IsOptional()
    @IsString()
    readonly birthDate: string;
}
