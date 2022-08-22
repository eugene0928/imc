import { Body, Controller, Get, ParseUUIDPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from "express";
import { StudentJwtGuard } from 'src/auth/guard';
import { StudentDto } from './dto';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
    constructor(private StudentService: StudentService) {}

    @Get("me")
    @UseGuards(StudentJwtGuard)
    getMe(@Req() req: Request) {
        return req.user
    }

    @Get("mark")
    @UseGuards(StudentJwtGuard)
    getMark(@Query("id", ParseUUIDPipe) id: string) {
        return this.StudentService.getMark(id)
    }
    
    @Put("fill-form")
    @UseGuards(StudentJwtGuard)
    fillForm(@Query("id", ParseUUIDPipe) id: string, @Body() dto: StudentDto) {
        return this.StudentService.fillForm(id, dto)
    }
}
