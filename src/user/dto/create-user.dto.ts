import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 40)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  @Length(6, 40)
  password: string;
}
