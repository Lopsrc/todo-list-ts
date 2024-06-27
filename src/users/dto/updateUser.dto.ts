import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDTO{

    @ApiProperty({example: 'Ivan', description: 'name of the user'})
    @IsOptional()
    @IsString({message: "Incorrect name"})
    readonly name: string;
    
    @ApiProperty({example: 'USER', description: 'role of the user'})
    @IsOptional()
    @IsString()
    readonly role: string;

    @ApiProperty({example: '2000-01-01', description: 'birthday of the user'})
    @IsOptional()
    @IsString()
    readonly birthDate: string;
}
