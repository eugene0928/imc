import { Body, Controller, Get, Param, ParseArrayPipe, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TeacherJwtGuard } from 'src/auth/guard';
import { EditMarkDto, FinalMarkDto, MidTermDdto } from './dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
    constructor(private TeacherService: TeacherService) {}

    @Get("me")
    @UseGuards(TeacherJwtGuard)
    getMe(@Req() req: Request) {
        return { status: 200, error: false, message: "Teacher's info", data: req.user }
    }

    @Get("subjects")
    @UseGuards(TeacherJwtGuard)
    getSubjects(@Req() req: Request) {
        return this.TeacherService.getSubjects(req.user)
    }

    @Get("groups")
    @UseGuards(TeacherJwtGuard)
    getGroups(@Req() req: Request) {
        return this.TeacherService.getGroups(req.user)
    }

    @Get("students/:group/:term")
    @UseGuards(TeacherJwtGuard)
    getStudentsByGroup(@Param() params: { group: string, term: string }, @Req() req: Request) {
        return this.TeacherService.getStudentsByGroup(params.group, params.term, req.user)
    }

    @Post("mark/:group/mid-term/:subject")
    @UseGuards(TeacherJwtGuard)
    markMidTerm(@Param() params: { group: string, subject: string }, @Body(new ParseArrayPipe({ items: MidTermDdto })) dto: MidTermDdto[]) {
        return this.TeacherService.markMidTerm(params, dto)
    }

    @Patch("mark/final/:id")
    @UseGuards(TeacherJwtGuard)
    markFinalTerm(@Param("id", ParseUUIDPipe) id: string, @Body() dto: FinalMarkDto) {
        return this.TeacherService.markFinalTerm(id, dto)
    }

    @Patch("mark/edit/:id")
    @UseGuards(TeacherJwtGuard)
    editMarks(@Param("id", ParseUUIDPipe) id: string, @Body() dto: EditMarkDto) {
        return this.TeacherService.editMarks(id, dto)
    }
}
