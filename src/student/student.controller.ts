import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { StudentJwtGuard } from 'src/auth/guard';
import { StudentDto } from './dto';
import { StudentService } from './student.service';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private StudentService: StudentService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  @UseGuards(StudentJwtGuard)
  getMe(@Req() req: Request) {
    return this.StudentService.getMe(req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('mark')
  @UseGuards(StudentJwtGuard)
  getMark(@Req() req: Request) {
    return this.StudentService.getMark(req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put('fill-form')
  @UseGuards(StudentJwtGuard)
  fillForm(@Req() req: Request, @Body() dto: StudentDto) {
    return this.StudentService.fillForm(req.user, dto);
  }
}
