import { IsNotEmpty, IsUUID, Matches } from "class-validator";

export class MidTermDdto {
    @IsNotEmpty()
    @IsUUID()
    student_id: string

    @IsNotEmpty()
    @IsUUID()
    semester_id: string

    @IsNotEmpty()
    @IsUUID()
    subject_id: string

    @IsNotEmpty()
    @Matches(/^[1-5]{1}$/)
    mid_term: string
}