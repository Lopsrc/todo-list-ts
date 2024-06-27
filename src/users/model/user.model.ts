import { ApiProperty } from "@nestjs/swagger";

export class User{
    @ApiProperty({example: 1, description: 'id of the user'})
    readonly id?: number;
    @ApiProperty({example: 'Ivan', description: 'name of the user'})
    readonly name?: string;
    @ApiProperty({example: 'ivan2000@example.com', description: 'email of the user'})
    readonly email: string;
    @ApiProperty({example: '12345678', description: 'pass hash of the user'})
    readonly pass_hash: string;
    @ApiProperty({example: 'rfrshtknhsh1234556', description: 'refresh token hash of the user'})
    readonly refresh_token_hash?: string;
    @ApiProperty({example: '2000-01-01', description: 'birthday of the user'})
    readonly birth_date?: Date;
    @ApiProperty({example: 'USER', description: 'role of the user'})
    readonly role?: string;
    @ApiProperty({example: true, description: 'is user deleted'})
    readonly del?: boolean;
}