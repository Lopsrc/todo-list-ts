import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDTO{

    @ApiProperty({example: 'Ivan', description: 'name of the user'})
    @IsOptional()
    @IsString({message: "Incorrect name"})
    readonly name?: string;
    
    @ApiProperty({example: 'USER', description: 'role of the user'})
    @IsOptional()
    @IsString()
    readonly role?: string;

    @ApiProperty({example: 'refresh_token', description: 'refresh token'})
    @IsString({message: "Incorrect token"})
    readonly refresh_token_hash?: string;

    @ApiProperty({example: '2000-01-01', description: 'birthday of the user'})
    @IsOptional()
    @IsString()
    readonly birthDate?: string;
}
