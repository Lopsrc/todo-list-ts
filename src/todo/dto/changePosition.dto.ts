import { IsNumber} from "class-validator";


export class ChangeTodoPositionDTO {
    @IsNumber()
    user_id: number;

    @IsNumber()
    oldPosition: number;

    @IsNumber()
    newPosition?: number;
}