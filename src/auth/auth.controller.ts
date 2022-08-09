import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login/super_admin")
    @HttpCode(200)
    loginSuperAdmin(@Body() dto: AuthDto) {
        return this.authService.loginSuperAdmin(dto)
    }

    @Post("login/admin")
    @HttpCode(200)
    loginAdmin(@Body() dto: AuthDto) {
        return this.authService.loginAdmin(dto)
    }

    @Post("login/teacher") 
    @HttpCode(200)
    loginTeacher(@Body() dto: AuthDto) {
        return this.authService.loginTeacher(dto)
    }

    @Post("login/student") 
    @HttpCode(200)
    loginStudent(@Body() dto: AuthDto) {
        return this.authService.loginStudent(dto)
    }
}
