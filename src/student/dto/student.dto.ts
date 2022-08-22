import { IsEmail, IsISO8601, IsNotEmpty, IsOptional, IsPhoneNumber, Length, Matches } from "class-validator"

export class StudentDto {
    @IsNotEmpty()
    @Matches(/^[A-Za-z]+$/)
    @Length(2, 255)
    name: string

    @IsNotEmpty()
    @Matches(/^[A-Za-z]+$/)
    @Length(2, 255)
    surname: string

    @IsNotEmpty()
    @IsISO8601()
    date_of_birth: Date

    @IsOptional()
    @Matches(/^(male)$|^(female)$/)
    gender?: string = "male"

    @IsNotEmpty()
    @IsPhoneNumber("UZ")
    phone_number: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @Length(5, 255)
    address: string

    @IsOptional()
    @Length(2, 50)
    @Matches(/^[A-Za-z]+$/)
    nationality?: string = "uzbek"

    @IsNotEmpty()
    @Matches(/^([A-Z]){2}\d{7}$/)
    passport_series_and_number: string

    @IsNotEmpty()
    @IsISO8601()
    date_issued: Date

    @IsNotEmpty()
    @Length(2, 255)
    issued_by: string

    @IsNotEmpty()
    @IsISO8601()
    date_expired: Date
}