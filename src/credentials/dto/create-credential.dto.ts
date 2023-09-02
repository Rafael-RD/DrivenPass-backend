import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class CreateCredentialDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  password: string;
}
