import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Length, Matches } from "class-validator";

export class AdminDto {
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @Length(3, 255)
  surname: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  gender?: string;
}


export class EditAdminDto {
  @IsOptional()
  @Length(3, 255)
  name?: string

  @IsOptional()
  @Length(3, 255)
  surname?: string

  @IsOptional()
  login?: string

  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
  password?: string

  @IsOptional()
  @IsPhoneNumber('UZ')
  phone_number?: string

  @IsOptional()
  @IsEmail()
  email?: string
}