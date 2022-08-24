import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { GroupTeacher, Mark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FinalMarkDto, MidTermDdto } from './dto';

@Injectable()
export class TeacherService {
    constructor(private prisma: PrismaService) {}

    async getGroups(teacher: any): Promise<{ status: number, error: boolean, message: string, data: GroupTeacher[] }> {
        try {
            // get groups
            const groups = await this.prisma.groupTeacher.findMany({ where: { teacher_id: teacher.id }, include: { groups: true } })
            if(!groups.length) {
                throw new BadGatewayException({
                    status: 400,
                    error: true,
                    message: "The teacher does not have any groups"
                })
            }
            // return response
            return { status: 200, error: false, message: "The teacher's available groups", data: groups }
        } catch (error) {
            throw error
        }
    }

    async getStudentsByGroup(group: string, term: string, teacher: any) {
        try {
            // get all students by group (nesting)
            let students = await this.prisma.group.findMany({
                where: { name: group },
                include: {
                    teachers: {
                        where: { teacher_id: teacher.id }
                    },
                    semesters: {
                        where: { name: term }
                    },
                    students: {
                        where: { deleted_at: null },
                        include: { mark: true }
                    }
                }
            })
            // delete password
            students = students.map(student => {
                student.students = student.students.map(actualStudent => {
                    delete actualStudent.password
                    return actualStudent
                })
                return student
            })
            // check if students exist
            if(!students.length) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "No available students for this group"
                })
            }
            // return response
            return { status: 200, error: false, message: "All available students", data: students }
        } catch (error) {
            throw error
        }
    }

    async markMidTerm(params: { group: string, subject: string }, dto: MidTermDdto[]) {
        try {
            // put marks all students once in db
            const marks = await this.prisma.mark.createMany({
                data: dto
            })
            // return response
            return { status: 201, error: false, message: "Mid-term marks are successfully inserted", data: marks }
        } catch (error) {
            throw error
        }
    }

    async markFinalTerm(id: string, dto: FinalMarkDto): Promise<{ status: number, error: boolean, message: string, data: Mark }> {
        try {
            // get data from db by id
            const mark = await this.prisma.mark.findFirst({ where: { id } })
            // check if exists
            if(!mark) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "The credential is not fount"
                })
            }
            // check if mid_term is exists
            if(!mark.mid_term) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Mid-term is not marked yet. Please, mark it first"
                })
            }
            // update data (mark final term)
            const updatedMidTerm = await this.prisma.mark.update({
                where: { id },
                data: { final_term: dto.final_term, total: `${(+dto.final_term + +mark.mid_term)/2}` }
            })
            // return response
            return { status: 200, error: false, message: "Final term is marked", data: updatedMidTerm }
        } catch (error) {
            throw error
        }
    }
}
