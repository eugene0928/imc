import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AdminDto, EditAdminDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { unlinkSync } from "fs";
import { join } from "path";
import { Admin } from '@prisma/client';

@Injectable()
export class SuperAdminService {
    constructor(private prisma: PrismaService) {}

    async addAdmin(dto: AdminDto, file, super_admin: any): Promise<{ status: number, error: boolean, message: string, data: string }> {
        try {
            // check file mimetype
            if(!file.mimetype.includes("image/")) {
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
            //hash the original password
            const hashedPassw = await argon.hash(dto.password)
            // insert data into db
            const newAdmin = await this.prisma.admin.create({
                data: {
                    name: dto.name,
                    surname: dto.surname,
                    login: dto.login,
                    password: hashedPassw,
                    email: dto.email,
                    phone_number: dto.phone_number,
                    gender: dto.gender,
                    super_admin_id: super_admin.id,
                    image: file.filename
                }
            })
            // return response
            return { status: 201, error: false, message: "Successfully created a new admin", data: newAdmin.login }
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

    async editAdmin(dto: EditAdminDto, id: string, super_admin: any): Promise<{ status: number, error: boolean, message: string, data: string }> {
        try {
            // get admin from db
            const admin = await this.prisma.admin.findFirst({ where: { id, deleted_at: null } })
            // if not found throw exception
            if(!admin) {
                throw new NotFoundException({
                    status: 404,
                    error: true,
                    message: "Such admin is not fount"
                })
            }
            // hash the original password
            if(dto.password) {
                dto.password = await argon.hash(dto.password)
            }
            
            // update if exists
            const updatedAdmin = await this.prisma.admin.update({ where: {
                id: id
                },
                data: {
                    ...dto,
                    super_admin_id: super_admin.id
                },
            })

            return { status: 200, error: false, message: "Credentials are updated successfully", data: updatedAdmin.login }
        } catch (error) {
            // for invalid uuid
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2023") {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Invalid admin id"
                })
            }
            // for violent unique constraints
            if(error instanceof PrismaClientKnownRequestError && error.code == "P2002") {
                throw new ForbiddenException({
                    status: 403,
                    error: true,
                    message: `${error.meta.target} already exist`
                })
            }
            throw error
        }
    }

    async deleteAdmin(id: string): Promise<{ status: number, error: boolean, message: string, data: null }> {
        try {
            // get admin from db
            const admin = await this.prisma.admin.findFirst({ where: { id, deleted_at: null } })
            // if not exists throw exception
            if(!admin) {
                throw new NotFoundException({
                    status: 404,
                    error: true,
                    message: "Such admin is not fount"
                })
            }
            // delete admin from db
            await this.prisma.admin.update({ 
                where: { id },
                data: { deleted_at: new Date() }
            })
            // return response
            return { status: 200, error: false, message: "Resource deleted successfully", data: null }
        } catch (error) {
            throw error
        }
    }

    async getAdmins(): Promise<{ status: number, error: boolean, message: string, data: any[] | null }> {
        const admins = await this.prisma.admin.findMany({ where: { deleted_at: null },
            select: {
                id: true,
                name: true,
                surname: true,
                login: true,
                image: true,
                gender: true,
                phone_number: true,
                email: true,
                created_at: true,
                updated_at: true
            }
        })

        if(!admins.length) {
            return { status: 200, error: false, message: "No admins available", data: null }
        }
        return { status: 200, error: false, message: "Available admins", data: admins }
    }
}
