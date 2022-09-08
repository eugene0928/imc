import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminJwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  EditStudentDto,
  editTeacherDto,
  editTeacherGroupDto,
  FacultyDto,
  GroupDto,
  newTeacherDto,
  SemesterDto,
  CreateStudentDto, 
  SubjectDto,
} from './dto';
import { myStorage } from 'src/helper';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('me')
  @UseGuards(AdminJwtGuard)
  async getMe(@Req() req: Request) {
    return { status: 200, message: 'Info', data: req.user };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('faculty')
  @UseGuards(AdminJwtGuard)
  async getFaculty() {
    return this.adminService.getFaculty();
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: newTeacherDto })
  @Post('add-teacher')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: myStorage,
    }),
  )
  async addTeacher(
    @Body() dto: newTeacherDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.adminService.addTeacher(dto, file, req.user);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({
    schema: {
      properties: {
        teacher_id: { type: 'string' },
        group_id: { type: 'string' },
      },
    },
  })
  @Post('add-group-teacher')
  @UseGuards(AdminJwtGuard)
  async addGroupTeacher(
    @Body()
    dto:
      | { teacher_id: string; group_id: string }
      | { teacher_id: string; group_id: string }[],
  ) {
    return this.adminService.addTeacherGroups(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-teacher')
  @UseGuards(AdminJwtGuard)
  async editTeacher(
    @Query('id', ParseUUIDPipe) id: string,
    @Body() dto: editTeacherDto,
    @Req() req: Request,
  ) {
    return this.adminService.editTeacher(id, dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-teacher-group')
  @UseGuards(AdminJwtGuard)
  async editTeacherGroup(
    @Query('id', ParseUUIDPipe) id: string,
    @Query('group_id', ParseUUIDPipe) group_id: string,
    @Body() dto: editTeacherGroupDto,
  ) {
    return this.adminService.editTeacherGroups(id, group_id, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-teacher')
  @UseGuards(AdminJwtGuard)
  async deleteTeacher(@Query('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteTeacher(id);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: FacultyDto })
  @Post('add-faculty')
  @UseGuards(AdminJwtGuard)
  async addFaculty(@Body() dto: FacultyDto, @Req() req: Request) {
    return this.adminService.addFaculty(dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-faculty')
  @UseGuards(AdminJwtGuard)
  async editFaculty(
    @Query('id', ParseUUIDPipe) id: string,
    @Body() dto: FacultyDto,
    @Req() req: Request,
  ) {
    return this.adminService.editFaculty(id, dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-faculty')
  @UseGuards(AdminJwtGuard)
  deleteFaculty(@Query('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteFaculty(id);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStudentDto })
  @Post('add-student')
  @UseGuards(AdminJwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: myStorage,
    }),
  )
  addStudent(
    @Body() dto: CreateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminService.addStudent(dto, file);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-student')
  @UseGuards(AdminJwtGuard)
  async editStudent(
    @Query('id', ParseUUIDPipe) id: string,
    @Body() dto: EditStudentDto,
  ) {
    return this.adminService.editStudent(id, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-student')
  @UseGuards(AdminJwtGuard)
  async deleteStudent(@Query('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteStudent(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('subjects')
  @UseGuards(AdminJwtGuard)
  getAllSubjects() {
    return this.adminService.getAllSubjects();
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('add-subject')
  @UseGuards(AdminJwtGuard)
  createSubject(@Body() dto: SubjectDto, @Req() req: Request) {
    return this.adminService.createSubject(dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-subject')
  @UseGuards(AdminJwtGuard)
  editSubject(
    @Query('id', ParseUUIDPipe) id: string,
    @Body() dto: SubjectDto,
    @Req() req: Request,
  ) {
    return this.adminService.editSubject(id, dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-subject')
  @UseGuards(AdminJwtGuard)
  deleteSubject(@Query('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteSubject(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('groups')
  @UseGuards(AdminJwtGuard)
  getGroups() {
    return this.adminService.getAllGroups();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('teachers')
  @UseGuards(AdminJwtGuard)
  getTeachers() {
    return this.adminService.getTeachers();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('students')
  @UseGuards(AdminJwtGuard)
  getStudents() {
    return this.adminService.getStudents();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('student/:login')
  @UseGuards(AdminJwtGuard)
  getStudentByLogin(@Param('login') login: string) {
    return this.adminService.getStudentByLogin(login);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('add-group')
  @UseGuards(AdminJwtGuard)
  addGroup(@Body() dto: GroupDto) {
    return this.adminService.createGroup(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-group')
  @UseGuards(AdminJwtGuard)
  editGroup(@Query('id', ParseUUIDPipe) id: string, @Body() dto: GroupDto) {
    return this.adminService.editGroup(id, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-group')
  @UseGuards(AdminJwtGuard)
  deleteGroup(@Query('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteGroup(id);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('add-semester')
  @UseGuards(AdminJwtGuard)
  createSemester(@Body() dto: SemesterDto, @Req() req: Request) {
    return this.adminService.createSemester(dto, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('semester')
  @UseGuards(AdminJwtGuard)
  getGroup(@Query('name') name: string, @Query('date') date: Date) {
    return this.adminService.getSemesterByDateAndName(name, date);
  }
}
