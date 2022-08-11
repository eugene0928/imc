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
