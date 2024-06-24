import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDTO{
    
    @IsNotEmpty()
    @IsString({message: "Incorrect token"})
    readonly accessToken: string;
    
    @IsNotEmpty()
    @IsString({message: "Incorrect token"})
    readonly refreshToken: string;
}