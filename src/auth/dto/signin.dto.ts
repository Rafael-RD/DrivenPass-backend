import { IsString, IsNotEmpty, IsEmail, Length } from "class-validator";

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 40)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 40)
  password: string;
}