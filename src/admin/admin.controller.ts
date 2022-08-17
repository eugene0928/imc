import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminJwtGuard } from 'src/auth/guard';
import { Request } from "express";
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { newTeacherDto } from './dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Get("me")
    @UseGuards(AdminJwtGuard)
    async getMe(@Req() req: Request) {
        return req.user
    }

    @Post("add-teacher")
    @UseGuards(AdminJwtGuard)
    @UseInterceptors(FileInterceptor("file", {
        dest: "uploads/",
    }))
    async addTeacher(@Body() dto: newTeacherDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        return this.adminService.addTeacher(dto, file, req.user)
    }

    @Post("add-group-teacher")
    @UseGuards(AdminJwtGuard)
    async addGroupTeacher(@Body() dto: { teacher_id: string, group_id: string }|{ teacher_id: string, group_id: string }[]) {
        return this.adminService.addTeacherGroups(dto)
    }

    @Patch("edit-teacher")
    @UseGuards(AdminJwtGuard)
    async editTeacher() {
        return this.adminService.editTeacher()
    }


    @Delete()
    @UseGuards(AdminJwtGuard)
    async deleteTeacher() {
        return this.adminService.deleteTeacher()
    }

    @Post("add-student")
    @UseGuards(AdminJwtGuard)
    async addStudent(@Body() dto) {
        console.log(dto)
        return this.adminService.addStudent()
    }

    @Patch()
    @UseGuards(AdminJwtGuard)
    async editStudent() {
        return this.adminService.editStudent()
    }

    @Delete()
    @UseGuards(AdminJwtGuard)
    async deleteStudent() {
        return this.adminService.deleteStudent()
    }
}
