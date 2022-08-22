import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentDto } from './dto';

@Injectable()
export class StudentService {
    constructor(private prisma: PrismaService) {}

    async fillForm(id: string, dto: StudentDto) {
        try {
            // get student from db
            const student = await this.prisma.student.findFirst({ where: { id, deleted_at: null } })
            // check if exists
            if(!student) {
                throw new BadRequestException({
                    status: 400, 
                    error: true,
                    message: "The student is not fount"
                })
            }
            // check if credentials are filled or not by is_completed column
            if(student.is_completed) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Student's credentials have been already updated. To change credentials, please contact the student department"
                })
            }
            // update record
            const updatedStudent = await this.prisma.student.update({
                where: { id },
                data: {
                    name: dto.name,
                    surname: dto.surname,
                    date_of_birth: new Date(dto.date_of_birth),
                    gender: dto.gender,
                    phone_number: dto.phone_number,
                    email: dto.email,
                    address: dto.address,
                    nationality: dto.nationality,
                    passport_series_and_number: dto.passport_series_and_number,
                    date_issued: new Date(dto.date_issued),
                    date_expired: new Date(dto.date_expired),
                    issued_by: dto.issued_by,
                    is_completed: true
                }
            })
            // delete password
            delete updatedStudent.password
            // return response
            return { status: 200, error: false, message: "Credentials are updated successfully", data: updatedStudent }
        } catch (error) {
            if(error.code == "P2002") {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: error.message
                })
            }
            throw error
        }
    }
    
    async getMark(id: string) {
        try {
            // get all mark from db
            let marks = await this.prisma.mark.findMany({ where: { student_id: id, deleted_at: null }, include: { subject: true, semester: true,  student: true } })
            // check if exists
            if(!marks.length) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "The student's marks are not available"
                })
            }
            // delete student's password
            marks = marks.map(mark => {
                delete mark.student.password
                return mark
            })
            // return response
            return { status: 200, error: false, message: "The student's marks", data: marks }
        } catch (error) {
            throw error
        }
    }
}
