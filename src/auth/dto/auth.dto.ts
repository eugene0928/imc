import { IsEmail, IsNotEmpty, IsPhoneNumber, Length, Matches } from "class-validator"
import { File } from "src/interfaces"

export class AuthDto {
    @IsNotEmpty()
    login: string

    @IsNotEmpty()
    password: string
}

export class Token {
    id: string
    name: string
    status: string
}

export class AdminDto {
    @IsNotEmpty()
    @Length(3, 255)
    name: string

    @IsNotEmpty()
    @Length(3, 255)
    surname: string

    @IsNotEmpty()
    login: string

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
    password: string 

    @IsEmail() 
    @IsNotEmpty()
    email: string 

    @IsNotEmpty() 
    @IsPhoneNumber("UZ")
    phone_number: string
    
    file: File

    gender?: string
}