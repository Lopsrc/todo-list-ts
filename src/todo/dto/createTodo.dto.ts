import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTodoDTO{
    @ApiProperty({example: 'Some name', description: 'name of the todo'})
    @IsString()
    readonly name: string;

    @ApiProperty({example: 'some description', description: 'description of the todo'})
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiProperty({example: 2, description: 'progress id of the todo'})
    @IsNumber()
    readonly progress_id: number;


}