import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
