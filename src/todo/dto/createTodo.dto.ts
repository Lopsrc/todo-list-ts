import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTodoDTO{
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    // @IsOptional()
    // @IsNumber()
    // position?: number;

    @IsNumber()
    readonly progress_id: number;


}