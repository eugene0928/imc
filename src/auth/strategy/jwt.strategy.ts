import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Token } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("SECRET_KEY"),
        })
    }

    async validate(payload: Token) {
        if(payload.status == "super_admin") {
            const super_admin = await this.prisma.super_admin.findUnique({ where: { id: payload.id } })
            delete super_admin.password
            return super_admin
        }

        if(payload.status == "admin") {
            const admin =  await this.prisma.admin.findUnique({ where: { id: payload.id } })
            delete admin.password
            return admin
        }

        if(payload.status == "teacher") {
            const teacher = await this.prisma.teacher.findUnique({ where: { id: payload.id } })
            delete teacher.password
            return teacher
        }

        if(payload.status == "student") {
            const student = await this.prisma.student.findUnique({ where: { id: payload.id } })
            delete student.password
            return student
        }
    }
}