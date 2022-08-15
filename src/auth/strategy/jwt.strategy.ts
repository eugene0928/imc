import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Token } from "../dto";

@Injectable()
export class SuperJwtStrategy extends PassportStrategy(Strategy, "superjwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("SECRET_KEY"),
        })
    }

    async validate(payload: Token) {
        // get super from db
        const super_admin = await this.prisma.super_admin.findFirst({ where: { id: payload.id, deleted_at: null } })
        // if they dont exist return null to block the route
        if(!super_admin) return null
        // if exists delele hashed passw
        delete super_admin.password
        // return super
        return super_admin
    }
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "adminjwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("SECRET_KEY"),
        })
    }

    async validate(payload: Token) {
        // get admin from db
        const admin = await this.prisma.admin.findFirst({ where: { id: payload.id, deleted_at: null } })
        // if not exists return null to block the route
        if(!admin) return null
        // if exists delete hashed passw
        delete admin.password
        // return admin
        return admin
    }
}

@Injectable()
export class TeacherJwtStrategy extends PassportStrategy(Strategy, "teacherjwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("SECRET_KEY"),
        })
    }

    async validate(payload: Token) {
        // get teacher from db
        const teacher = await this.prisma.teacher.findFirst({ where: { id: payload.id, deleted_at: null } })
        // if not exists return null to block the route
        if(!teacher) return null
        // if exists delete hashed passw
        delete teacher.password
        // return teacher
        return teacher
    }
}

@Injectable()
export class StudentJwtStrategy extends PassportStrategy(Strategy, "studentjwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("SECRET_KEY"),
        })
    }

    async validate(payload: Token) {
        // get student from db
        const student = await this.prisma.student.findFirst({ where: { id: payload.id, deleted_at: null } })
        // if not exists return null to block the route
        if(!student) return null
        // if exists delete hashed passw
        delete student.password
        // return student
        return student
    }
}