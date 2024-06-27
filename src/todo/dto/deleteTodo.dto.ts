import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteTodoDTO {
    @ApiProperty({example: 1, description: 'id of the todo'})
    @IsNumber()
    id: number;
}