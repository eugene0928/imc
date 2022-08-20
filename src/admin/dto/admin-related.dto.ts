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

export class StudentDto {
    @IsNotEmpty()
    login: string

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/)
    password: string

    @IsNotEmpty()
    @IsUUID()
    faculty_id: string

    @IsNotEmpty()
    @IsUUID()
    group_id: string

    file: File
}

export class EditStudentDto {
    @IsOptional()
    login?: string

    @IsOptional()
    password?: string

    @IsOptional()
    @Matches(/^[A-Za-z]+$/)
    name?: string

    @IsOptional()
    @Matches(/^[A-Za-z]+$/)
    surname?: string

    @IsOptional()
    @IsISO8601()
    date_of_birth?: string

    @IsOptional()
    @Matches(/^(male)$|^(female)$/)
    gender?: string

    @IsOptional()
    @IsPhoneNumber("UZ")
    phone_number?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    address?: string

    @IsOptional()
    nationality?: string
    
    @IsOptional()
    inn?: string

    @IsOptional()
    password_series_and_number?: string

    @IsOptional()
    @IsISO8601()
    date_issued?: string

    @IsOptional()
    issued_by?: string

    @IsOptional()
    @IsISO8601()
    date_expired?: string

    @IsOptional()
    @IsUUID()
    faculty_id?: string

    @IsOptional()
    @IsUUID()
    group_id?: string
}

export class SubjectDto {
    @IsNotEmpty()
    @Matches(/^[A-Za-z\s]+$/)
    name: string
}

export class GroupDto {
    @IsNotEmpty()
    @Length(1, 1)
    name: string
}
// export class groupDto {
//     groups: {teacher_id: string, group_id: string} | {teacher_id: string, group_id: string}[]
// }