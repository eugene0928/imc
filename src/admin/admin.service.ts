import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { GroupTeacher, Teacher } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { editTeacherDto, editTeacherGroupDto, newTeacherDto } from './dto';
import * as argon from "argon2";

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async addTeacher(dto: newTeacherDto, file: Express.Multer.File, admin: any): Promise<{ status: number, message: string, error: boolean, data: Teacher }> {
        try {
            // check file mimetype
            if(!(file.mimetype.includes("image/"))) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Invalid file mimetype. Only images will be accepted(file size should be no more than 5mb)"
                })
            }
            // check file size
            if(file.size > 5 * 1024 * 1024) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "File size should be no more than 5mb"
                })
            }
            // hash the original passw
            dto.password = await argon.hash(dto.password)
            // insert data into db (only teacher's info)
            const teacher = await this.prisma.teacher.create({
                data: {
                    name: dto.name,
                    surname: dto.surname,
                    family_name: dto.family_name,
                    login: dto.login,
                    password: dto.password,
                    image: file.filename,
                    gender: dto.gender ? dto.gender : "male",
                    phone_number: dto.phone_number,
                    email: dto.email,
                    date_of_birth: new Date(dto.date_of_birth),
                    subject_id: dto.subject_id,
                    admin_id: admin.id
                }
            })
            // delete the passw of a teacher
            delete teacher.password
            // return response
            return { status: 201, message: "Teacher is added successfully", error: false, data: teacher }
        } catch (error) {
            unlinkSync(join(process.cwd(), "uploads", file.filename))
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
                throw new ForbiddenException({
                    status: 403,
                    error: true,
                    message: "Invalid input. Violent unique constraints"
                })
            }
            throw error
        }
    }

    async addTeacherGroups(dto: { teacher_id: string, group_id: string }|{ teacher_id: string, group_id: string }[]): Promise<{ status: number, error: boolean, message: string, data: {} }> {
        try {
            // create record on db
            const groups = await this.prisma.groupTeacher.createMany({
                data: dto
            })
            // return response
            return { status: 201, error: false, message: "Groups are successfully added", data: groups }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2023") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }
            
            if(error instanceof PrismaClientValidationError) {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }

            if(error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }
            throw error
        }
    }

    async editTeacher(id: string, dto: editTeacherDto, admin: any): Promise<{ status: number, error: boolean, message: string, data: Teacher }> {
        try {   
            // get teacher from db
            const teacher = await this.prisma.teacher.findFirst({ where: { id, deleted_at: null } })
            // check if exists
            if(!teacher) {
                throw new BadRequestException({
                    status: 400, 
                    error: true,
                    message: "Such teacher is not fount"
                })
            }
            // check if dto is empty
            if(!(Object.keys(dto).length)) {
                delete teacher.password
                return { status: 200, error: false, message: "Nothing is updated", data: teacher }
            }
            // update db 
            const updatedTeacher = await this.prisma.teacher.update({ 
                where: { id },
                data: {
                    ...dto,
                    admin_id: admin.id
                }
            })
            // delete password
            delete updatedTeacher.password
            // return response
            return { status: 200, error: false, message: "Teacher's credentials are successfully updated", data: updatedTeacher }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2023") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }

            if(error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }
            throw error
        }
    }

    async editTeacherGroups(id: string, group_id: string, dto: editTeacherGroupDto): Promise<{ status: number, error: boolean, message: string, data: GroupTeacher }> {
        try {
            // get teacher from groupteacher table
            const teacherGroups = await this.prisma.groupTeacher.findFirst({ where: { teacher_id: id, group_id } })
            // check if record is exists
            if(!teacherGroups) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Such teacher is not fount or the teacher does not have such group"
                })
            }
            // check if dto is exists
            if(Object.keys(dto).length == 0) {
                return { status: 200, error: false, message: "Nothing is updated", data: teacherGroups }
            }
            // udpate db
            const updatedTeacherGroups = await this.prisma.groupTeacher.update({
                where: { teacher_id_group_id: { group_id, teacher_id: id } },
                data: {
                    ...dto
                }
            })
            // return response
            return { status: 200, error: false, message: "Teacher's group is successfully updated", data: updatedTeacherGroups }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2023") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }

            if(error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
                throw new BadRequestException({
                    status: 400, error: true, message: error.message
                })
            }
            throw error
        }
    }

    deleteTeacher() {

    }

    addStudent() {

    }

    editStudent() {

    }

    deleteStudent() {

    }
}
