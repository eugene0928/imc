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
                    message: "Student's credentials have been already updated"
                })
            }
            // update record
            const updatedStudent = await this.prisma.student.update({
                where: { id },
                data: dto
            })
            // delete password
            delete updatedStudent.password
            // return response
            return { status: 200, error: false, message: "Credentials are updated successfully", data: updatedStudent }
        } catch (error) {
            throw error
        }
    }
}
