import { ApiProperty } from "@nestjs/swagger";
import { CardType } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @ApiProperty({ example: '1234567890123456', description: '16 digits' })
  @IsNumberString()
  @Length(16, 16)
  number: string;

  @IsString()
  @Length(3, 50)
  owner: string;

  @ApiProperty({ example: '123', description: '3 digits' })
  @IsNumberString()
  @Length(3, 3)
  cvv: string;

  @ApiProperty({ example: '01/25', description: 'MM/YY' })
  @IsString()
  @Length(5, 5)
  expiration: string;

  @ApiProperty({ example: '1234', description: '4-8 digits' })
  @IsNumberString()
  @Length(4, 8)
  password: string;

  @IsBoolean()
  virtual: boolean;

  @ApiProperty({ enum: CardType })
  @IsString()
  @IsEnum(CardType)
  type: CardType;
}
