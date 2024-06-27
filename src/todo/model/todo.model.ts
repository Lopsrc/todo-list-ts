import { ApiProperty } from "@nestjs/swagger";

export class Todo {
    @ApiProperty({example: 1, description: 'id of the todo'})
    id: number;

    @ApiProperty({example: 'Some name', description: 'name of the todo'})
    name: string;

    @ApiProperty({example: 'Some description', description: 'description of the todo'})
    description: string;

    @ApiProperty({example: '2002-02-02', description: 'timestamp (create) of the todo'})
    created_at: Date;

    @ApiProperty({example: 2, description: 'position of the todo'})
    position: number;

    @ApiProperty({example: 2, description: 'progress id of the todo'})
    progress_id: number;

    @ApiProperty({example: 2, description: 'user_id of the todo'})
    user_id: number;
}