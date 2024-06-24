
export class User{
    readonly id?: number;
    readonly name?: string;
    readonly email: string;
    readonly pass_hash: string;
    readonly refresh_token_hash?: string;
    readonly birth_date?: Date;
    readonly role?: string;
    readonly del?: boolean;
}