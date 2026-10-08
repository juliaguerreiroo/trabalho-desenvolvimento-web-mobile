import { IsEmail, IsNotEmpty, Length, MinLength } from "class-validator";
export class CreateUserDTO {
    @IsNotEmpty()
    @Length(3, 100)
    name: string = '';
    @IsNotEmpty()
    @IsEmail()
    email: string = '';
    @IsNotEmpty()
    @MinLength(8)
    passwordHash: string = '';
}