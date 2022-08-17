import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from "argon2";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    async loginSuperAdmin(dto: AuthDto): Promise<{ status: number, error: boolean, message: string, token: string }> {
        // get super_admin from db
        const super_admin = await this.prisma.super_admin.findFirst({ where: { login: dto.login } })
        // check if exists
        if(!super_admin) {
            throw new ForbiddenException({ 
                status: 403,
                error: true,
                message: "Invalid login or password"
            })
        }
        // check the hashed passw with raw passw
        let psMatched = null
        try {
            psMatched = await argon.verify(super_admin.password, dto.password)
        } catch (error: any) {
            throw new BadRequestException({
                status: 400,
                error: true,
                message: error.message
            })
        }
        if(!psMatched) {
            throw new ForbiddenException({
                status: 403,
                error: true,
                message: "Invalid login or password"
            })
        }

        return { status: 200, error: false, message: "Successfully logged in", token: await this.singToken(super_admin.id, super_admin.name, "super_admin") }
    }

    async loginAdmin(dto: AuthDto): Promise<{ status: number, error: boolean, message: string, token: string }> {
        // get admin from db
        const admin = await this.prisma.admin.findFirst({ where: { login: dto.login } })
        // check if exists
        if(!admin) throw new ForbiddenException({ 
            status: 403,
            error: true,
            message: "Invalid login or password"
        })
        // check the hashed passw with raw passw
        let psMatched = null
        try {
            psMatched = await argon.verify(admin.password, dto.password)
        } catch (error: any) {
            throw new BadRequestException({
                status: 400,
                error: true,
                message: error.message
            })
        }

        if(!psMatched) {
            throw new ForbiddenException({ 
                status: 403,
                error: true,
                message: "Invalid login or password"
            })
        }

        return { status: 200, error: false, message: "Successfully logged in", token: await this.singToken(admin.id, admin.name, "admin") }
    }

    async loginTeacher(dto: AuthDto): Promise<{ status: number, error: boolean, message: string, token: string }> {
        // get teacher from db
        const teacher = await this.prisma.teacher.findFirst({ where: { login: dto.login } })
        // check if exists
        if(!teacher) throw new ForbiddenException({ 
            status: 403,
            error: true,
            message: "Invalid login or password"
        })
        // check the hashed passw with raw passw
        let psMatched = null
        try {
            psMatched = await argon.verify(teacher.password, dto.password)
        } catch (error: any) {
            throw new BadRequestException({
                status: 400,
                error: true,
                message: error.message
            })
        }

        if(!psMatched) {
            throw new ForbiddenException({
                status: 403,
                error: true,
                message: "Invalid login or password"
            })
        }

        return { status: 200, error: false, message: "Successfully logged in", token: await this.singToken(teacher.id, teacher.name, "teacher") }
    }

    async loginStudent(dto: AuthDto): Promise<{ status: number, error: boolean, message: string, token: string }> {
        // get teacher from db
        const student = await this.prisma.student.findFirst({ where: { login: dto.login } })
        // check if exists
        if(!student) throw new ForbiddenException({ 
            status: 403,
            error: true,
            message: "Invalid login or password"
        })
        // check the hashed passw with raw passw
        let psMatched = null
        try {
            psMatched = await argon.verify(student.password, dto.password)
        } catch (error: any) {
            throw new BadRequestException({
                status: 400,
                error: true,
                message: error.message
            })
        }

        if(!psMatched) {
            throw new ForbiddenException({
                status: 403,
                error: true,
                message: "Invalid login or password"
            })
        }

        return { status: 200, error: false, message: "Successfully logged in", token: await this.singToken(student.id, student.name, "student") }
    }

    singToken(id: string, name: string, status: string ): Promise<string> {
        return this.jwt.signAsync({ id, name, status }, {
            secret: this.config.get("SECRET_KEY")
        })
    }
}
