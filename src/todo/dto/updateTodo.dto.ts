import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTodoDTO {
    @ApiProperty({example: 1, description: 'id of the todo'})
    @IsNumber()
    id: number;

    @ApiProperty({example: 'Some todo', description: 'name of the todo'})
    @IsOptional()
    @IsString()
    readonly name?: string;

    @ApiProperty({example: 'Some description', description: 'description of the todo'})
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiProperty({example: 'Ivan', description: 'progress id of the todo'})
    @IsOptional()
    @IsNumber()
    readonly progress_id?: number;
}