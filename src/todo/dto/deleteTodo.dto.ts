import { IsNumber } from "class-validator";

export class DeleteTodoDTO {
    @IsNumber()
    id: number;
}