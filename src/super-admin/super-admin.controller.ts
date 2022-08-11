import { Body, Controller, Delete, Get, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
import { AdminDto, EditAdminDto } from './dto';
import { SuperJwtGuard } from 'src/auth/guard';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
export class SuperAdminController {    
    constructor(private superService: SuperAdminService) {} 

    @Get("me")
    @UseGuards(SuperJwtGuard)
    getMe(@Req() req: Request) {
        return req.user
    }

    @Post("add-admin")
    @UseGuards(SuperJwtGuard)
    @UseInterceptors(FileInterceptor("file", {
        dest: "uploads/",
    }))
    async addAdmin(@Body() dto: AdminDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        return this.superService.addAdmin(dto, file, req.user)
    }

    @Patch("edit-admin")
    @UseGuards(SuperJwtGuard)
    async editAdmin(@Query("id", ParseUUIDPipe) id: string, @Body() dto: EditAdminDto, @Req() req: Request){
        return this.superService.editAdmin(dto, id, req.user)
    }

    @Delete("delete-admin")
    @UseGuards(SuperJwtGuard)
    async deleteAdmin(@Query("id", ParseUUIDPipe) id: string) {
        return this.superService.deleteAdmin(id)
    }

    @Get("admins")
    @UseGuards(SuperJwtGuard)
    async getAdmins() {
        return this.superService.getAdmins()
    }
}
