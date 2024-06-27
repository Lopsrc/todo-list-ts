import { ApiProperty } from "@nestjs/swagger";
import { IsNumber} from "class-validator";


export class ChangeTodoPositionDTO {
    @ApiProperty({example: 2, description: 'user_id of the todo'})
    @IsNumber()
    user_id: number;

    @ApiProperty({example: 'Ivan', description: 'old position of the todo'})
    @IsNumber()
    oldPosition: number;

    @ApiProperty({example: 'Ivan', description: 'new position of the todo'})
    @IsNumber()
    newPosition?: number;
}