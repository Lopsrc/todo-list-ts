import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTodoDTO {
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsNumber()
    readonly progress_id?: number;
}