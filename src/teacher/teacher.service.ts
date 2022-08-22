import { BadGatewayException, Injectable } from '@nestjs/common';
import { GroupTeacher } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
    constructor(private prisma: PrismaService) {}

    async getGroups(teacher: any): Promise<{ status: number, error: false, message: string, data: GroupTeacher[] }> {
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
}
