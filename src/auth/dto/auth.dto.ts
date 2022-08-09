import { IsNotEmpty } from "class-validator"

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