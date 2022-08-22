import { Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { TeacherJwtGuard } from 'src/auth/guard';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
    constructor(private teacherService: TeacherService) {}

    @Get("me")
    @UseGuards(TeacherJwtGuard)
    getMe() {

    }

    @Get("groups")
    @UseGuards(TeacherJwtGuard)
    getGroups() {

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
