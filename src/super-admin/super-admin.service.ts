import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { AdminDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class SuperAdminService {
    constructor(private prisma: PrismaService) {}

    async addAdmin(dto: AdminDto, file, user: any): Promise<{ status: number, message: string, data: string }> {
        try {
            // check file mimetype
            if(!file.mimetype.includes("image/")) {
                throw new BadRequestException({
                    status: 400,
                    error: true,
                    message: "Invalid file mimetype. Only images will be accepted(file size should be no more than 5mb)"
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
                    super_admin_id: user.id,
                    image: file.filename
                }
            })
            // return response
            return { status: 201, message: "Successfully created new admin", data: newAdmin.login }
        } catch (error) {
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

    editAdmin() {

    }

    deleteAdmin() {

    }

    getAdmins() {

    }
}
