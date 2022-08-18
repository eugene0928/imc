import { IsDate, IsEmail, IsISO8601, IsNotEmpty, IsNotEmptyObject, IsOptional, IsPhoneNumber, IsUUID, Length, Matches } from "class-validator"

export class newTeacherDto {
    @IsNotEmpty()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    name: string

    @IsNotEmpty()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    surname: string

    @IsNotEmpty()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    family_name: string

    @IsNotEmpty()
    @Length(3, 255)
    login: string

    @IsNotEmpty()
    @Length(3, 255)
    password: string

    file: File

    @IsOptional()
    gender?: string

    @IsNotEmpty()
    @IsPhoneNumber("UZ")
    phone_number: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsISO8601()
    date_of_birth: string

    @IsNotEmpty()
    subject_id: string
}

export class editTeacherDto {
    @IsOptional()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    name?: string

    @IsOptional()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    surname?: string

    @IsOptional()
    @Length(3, 255)
    @Matches(/^[A-Za-z]+$/)
    family_name?: string

    @IsOptional()
    @Length(3, 255)
    login?: string

    @IsOptional()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
    password?: string

    @IsOptional()
    gender?: string

    @IsOptional()
    @IsPhoneNumber("UZ")
    phone_number?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsISO8601()
    date_of_birth?: string

    @IsOptional()
    @IsUUID()
    subject_id?: string
}

export class editTeacherGroupDto {
    @IsOptional()
    @IsUUID()
    group_id: string
}

export class FacultyDto {
    @IsNotEmpty()
    @Matches(/^[A-Za-z]+$/)
    name: string
}

// export class groupDto {
//     groups: {teacher_id: string, group_id: string} | {teacher_id: string, group_id: string}[]
// }