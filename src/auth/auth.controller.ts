import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login/super-admin")
    @ApiOkResponse({ description: "Successfully logged in" })
    @ApiForbiddenResponse({ description: "Forbidden" })
    @HttpCode(200)
    loginSuperAdmin(@Body() dto: AuthDto) {
        return this.authService.loginSuperAdmin(dto)
    }

    @Post("login/admin")
    @ApiOkResponse({ description: "Successfully logged in" })
    @ApiForbiddenResponse({ description: "Forbidden" })
    @HttpCode(200)
    loginAdmin(@Body() dto: AuthDto) {
        return this.authService.loginAdmin(dto)
    }

    @Post("login/teacher") 
    @ApiOkResponse({ description: "Successfully logged in" })
    @ApiForbiddenResponse({ description: "Forbidden" })
    @HttpCode(200)
    loginTeacher(@Body() dto: AuthDto) {
        return this.authService.loginTeacher(dto)
    }

    @Post("login/student") 
    @ApiOkResponse({ description: "Successfully logged in" })
    @ApiForbiddenResponse({ description: "Forbidden" })
    @HttpCode(200)
    loginStudent(@Body() dto: AuthDto) {
        return this.authService.loginStudent(dto)
    }
}
