import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminJwtGuard } from 'src/auth/guard';
import { Request } from "express";
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editTeacherDto, editTeacherGroupDto, FacultyDto, newTeacherDto } from './dto';

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
    async editTeacher(@Query("id", ParseUUIDPipe) id: string, @Body() dto: editTeacherDto, @Req() req: Request) {
        return this.adminService.editTeacher(id, dto, req.user)
    }

    @Patch("edit-teacher-group")
    @UseGuards(AdminJwtGuard)
    async editTeacherGroup(@Query("id", ParseUUIDPipe) id: string, @Query("group_id", ParseUUIDPipe) group_id: string, @Body() dto: editTeacherGroupDto) {
        return this.adminService.editTeacherGroups(id, group_id, dto)
    }

    @Delete("delete-teacher")
    @UseGuards(AdminJwtGuard)
    async deleteTeacher(@Query("id", ParseUUIDPipe) id: string) {
        return this.adminService.deleteTeacher(id)
    }

    @Post("add-faculty")
    @UseGuards(AdminJwtGuard)
    async addFaculty(@Body() dto: FacultyDto, @Req() req: Request) {
        return this.adminService.addFaculty(dto, req.user)
    }   

    @Patch("edit-faculty")
    @UseGuards(AdminJwtGuard)
    async editFaculty(@Query("id", ParseUUIDPipe) id: string, @Body() dto: FacultyDto, @Req() req: Request) {
        return this.adminService.editFaculty(id, dto, req.user)
    }

    @Delete("delete-faculty")
    @UseGuards(AdminJwtGuard)
    deleteFaculty(@Query("id", ParseUUIDPipe) id: string) {
        return this.adminService.deleteFaculty(id)
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
