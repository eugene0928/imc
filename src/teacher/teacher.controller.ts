import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TeacherJwtGuard } from 'src/auth/guard';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
    constructor(private TeacherService: TeacherService) {}

    @Get("me")
    @UseGuards(TeacherJwtGuard)
    getMe(@Req() req: Request) {
        return { status: 200, error: false, message: "Teacher's info", data: req.user }
    }

    @Get("groups")
    @UseGuards(TeacherJwtGuard)
    getGroups(@Req() req: Request) {
        return this.TeacherService.getGroups(req.user)
    }

    @Get("students/:group/:term")
    @UseGuards(TeacherJwtGuard)
    getStudentsByGroup() {

    }

    @Post("mark/:group/mid-term/:subject")
    @UseGuards(TeacherJwtGuard)
    markMidTerm() {

    }

    @Patch("mark/final/:term/:id/:subject")
    @UseGuards(TeacherJwtGuard)
    markFinalTerm() {

    }

    @Patch("mark/edit/:term/:id/:subject")
    @UseGuards(TeacherJwtGuard)
    editMarks() {

    }
}
