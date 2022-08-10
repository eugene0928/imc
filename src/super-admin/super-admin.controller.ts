import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
import { AdminDto } from 'src/auth/dto';
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
}
