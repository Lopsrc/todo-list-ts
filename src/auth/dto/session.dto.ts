import { ApiProperty } from "@nestjs/swagger";

export class SessionDTO {
    @ApiProperty({example: 1, description: 'id of the user'})
    id?: number;
    @ApiProperty({example: 'Ivan@mail.com', description: 'email of the user'})
    email?: string;
    @ApiProperty({example: 'refresh_token_hash', description: 'refresh token hash'})
    refresh_token_hash: string;
}