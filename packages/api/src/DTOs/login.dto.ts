import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class LoginDTO {
  @IsEmail()
    email!: string;

  @IsString()
    @MinLength(6)
    @MaxLength(100)
    password!: string;
}