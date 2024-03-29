import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Faculty,
  Group,
  GroupTeacher,
  Semester,
  Student,
  Subject,
  Teacher,
} from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
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
import * as argon from 'argon2';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getFaculty(): Promise<{ status: number, message: string, data: Faculty[] }> {
    try {
        // get faculties from db
        const faculties = await this.prisma.faculty.findMany({ where: { deleted_at: null } })
        // return response
        return { status: 200, message: 'All available faculties', data: faculties }
    } catch (error) {
        throw error
    }
  }


  async addTeacher(
    dto: newTeacherDto,
    file: Express.Multer.File,
    admin: any,
  ): Promise<{
    status: number;
    message: string;
    error: boolean;
    data: Teacher;
  }> {
    try {
      // check file mimetype
      if (!file.mimetype.includes('image/')) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message:
            'Invalid file mimetype. Only images will be accepted(file size should be no more than 5mb)',
        });
      }
      // check file size
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'File size should be no more than 5mb',
        });
      }
      // hash the original passw
      dto.password = await argon.hash(dto.password);
      // insert data into db (only teacher's info)
      const teacher = await this.prisma.teacher.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          family_name: dto.family_name,
          login: dto.login,
          password: dto.password,
          image: file.filename,
          gender: dto.gender ? dto.gender : 'male',
          phone_number: dto.phone_number,
          email: dto.email,
          date_of_birth: new Date(dto.date_of_birth),
          subject_id: dto.subject_id,
          admin_id: admin.id,
        },
      });
      // delete the passw of a teacher
      delete teacher.password;
      // return response
      return {
        status: 201,
        message: 'Teacher is added successfully',
        error: false,
        data: teacher,
      };
    } catch (error) {
      unlinkSync(join(process.cwd(), 'uploads', file.filename));
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new ForbiddenException({
          status: 403,
          error: true,
          message: 'Invalid input. Violent unique constraints',
        });
      }
      throw error;
    }
  }

  async addTeacherGroups(
    dto:
      | { teacher_id: string; group_id: string }
      | { teacher_id: string; group_id: string }[],
  ): Promise<{ status: number; error: boolean; message: string; data: {} }> {
    try {
      // create record on db
      const groups = await this.prisma.groupTeacher.createMany({
        data: dto,
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'Groups are successfully added',
        data: groups,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2023'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editTeacher(
    id: string,
    dto: editTeacherDto,
    admin: any,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Teacher;
  }> {
    try {
      // get teacher from db
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!teacher) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'Such teacher is not fount',
        });
      }
      // check if dto is empty
      if (!Object.keys(dto).length) {
        delete teacher.password;
        return {
          status: 200,
          error: false,
          message: 'Nothing is updated',
          data: teacher,
        };
      }
      // update db
      const updatedTeacher = await this.prisma.teacher.update({
        where: { id },
        data: {
          ...dto,
          admin_id: admin.id,
        },
      });
      // delete password
      delete updatedTeacher.password;
      // return response
      return {
        status: 200,
        error: false,
        message: "Teacher's credentials are successfully updated",
        data: updatedTeacher,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2023'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editTeacherGroups(
    id: string,
    group_id: string,
    dto: editTeacherGroupDto,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: GroupTeacher;
  }> {
    try {
      // get teacher from groupteacher table
      const teacherGroups = await this.prisma.groupTeacher.findFirst({
        where: { teacher_id: id, group_id },
      });
      // check if record is exists
      if (!teacherGroups) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message:
            'Such teacher is not fount or the teacher does not have such group',
        });
      }
      // check if dto is exists
      if (Object.keys(dto).length == 0) {
        return {
          status: 200,
          error: false,
          message: 'Nothing is updated',
          data: teacherGroups,
        };
      }
      // udpate db
      const updatedTeacherGroups = await this.prisma.groupTeacher.update({
        where: { teacher_id_group_id: { group_id, teacher_id: id } },
        data: {
          ...dto,
        },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: "Teacher's group is successfully updated",
        data: updatedTeacherGroups,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2023'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteTeacher(
    id: string,
  ): Promise<{ status: number; error: boolean; message: string; data: null }> {
    try {
      // get teacher from db
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, deleted_at: null },
      });
      // check if they aren't deleted
      if (!teacher) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The teacher is not fount',
        });
      }
      // soft delete from db
      await this.prisma.teacher.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      // soft delete teacher's all groups
      await this.prisma.groupTeacher.updateMany({
        where: { teacher_id: id },
        data: { deleted_at: new Date() },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Resource deleted successfully',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async addFaculty(
    dto: FacultyDto,
    admin,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Faculty;
  }> {
    try {
      // create new faculty in db
      const faculty = await this.prisma.faculty.create({
        data: {
          ...dto,
          admin_id: admin.id,
        },
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'Faculty is successfully added',
        data: faculty,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editFaculty(
    id: string,
    dto: FacultyDto,
    admin,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Faculty;
  }> {
    try {
      // get valid faculty from db
      const faculty = await this.prisma.faculty.findFirst({
        where: { id, deleted_at: null },
      });
      // check faculty if is deleted
      if (!faculty) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'Such faculty is not fount',
        });
      }
      // check if dto is the same in db
      if (dto.name == faculty.name) {
        return {
          status: 200,
          error: false,
          message: 'Nothing is updated',
          data: faculty,
        };
      }
      // update faculty in db
      const updatedFaculty = await this.prisma.faculty.update({
        where: { id },
        data: {
          ...dto,
          admin_id: admin.id,
        },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Faculty is successfully updated',
        data: updatedFaculty,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteFaculty(
    id: string,
  ): Promise<{ status: number; error: boolean; message: string; data: null }> {
    try {
      // get faculty from db
      const faculty = await this.prisma.faculty.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!faculty) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The faculty is not fount',
        });
      }
      // soft delete
      await this.prisma.faculty.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Resourse is successfully deleted',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async addStudent(
    dto: CreateStudentDto,
    file: Express.Multer.File,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: string;
  }> {
    try {
      // check file mimetype
      if (!file.mimetype.includes('image/')) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'Only images will be accepted(no more than 5mb)',
        });
      }
      // check file size
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message:
            'File size is too much. Only files which are no more than 5mb will be accepted',
        });
      }
      // hash original password
      dto.password = await argon.hash(dto.password);
      // create student in db
      const newStudent = await this.prisma.student.create({
        data: {
          login: dto.login,
          password: dto.password,
          image: file.filename,
          faculty_id: dto.faculty_id,
          group_id: dto.group_id,
        },
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'New student is added successfully',
        data: newStudent.login,
      };
    } catch (error) {
      unlinkSync(join(process.cwd(), 'uploads', file.filename));
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2003'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editStudent(id: string, dto: EditStudentDto) {
    try {
      // if password exists in dto, hash it
      if (dto.password) {
        dto.password = await argon.hash(dto.password);
      }
      // update student's credentials
      const student = await this.prisma.student.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: "Student's credentials are updated successfully",
        data: student.login,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteStudent(
    id: string,
  ): Promise<{ status: number; error: boolean; message: string; data: null }> {
    try {
      // get student from db
      const student = await this.prisma.student.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!student) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The student is not fount',
        });
      }
      // soft delete from db
      await this.prisma.student.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Resourse is deleted successfully',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllSubjects() {
    try {
      // get all available subjects from db
      const subjects = await this.prisma.subject.findMany();
      // return response
      return {
        status: 200,
        error: false,
        message: 'All available subjects',
        data: subjects,
      };
    } catch (error) {
      throw error;
    }
  }

  async createSubject(
    dto: SubjectDto,
    admin,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Subject;
  }> {
    try {
      // create subject into db
      const newSubject = await this.prisma.subject.create({
        data: { name: dto.name, admin_id: admin.id },
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'New subject is added successfully',
        data: newSubject,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editSubject(
    id: string,
    dto: SubjectDto,
    admin,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Subject;
  }> {
    try {
      // get subject from db
      const subject = await this.prisma.subject.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!subject) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The subject is not fount',
        });
      }
      // soft delete the subject
      const updatedSubject = await this.prisma.subject.update({
        where: { id },
        data: {
          ...dto,
          admin_id: admin.id,
        },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Subject is updated successfully',
        data: updatedSubject,
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteSubject(
    id: string,
  ): Promise<{ status: number; error: boolean; message: string; data: null }> {
    try {
      // get subject from db
      const subject = await this.prisma.subject.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!subject) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'Subject is not fount',
        });
      }
      // soft delete if
      await this.prisma.subject.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Resource is deleted successfully',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllGroups(): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Group[];
  }> {
    try {
      // get all groups from db
      const groups = await this.prisma.group.findMany();
      // return response
      return { status: 200, error: false, message: 'All groups', data: groups };
    } catch (error) {
      throw error;
    }
  }

  async getTeachers(): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Teacher[];
  }> {
    try {
      // get teachers from db
      let teachers = await this.prisma.teacher.findMany();
      // delete passwords
      teachers = teachers.map((teacher) => {
        delete teacher.password;
        return teacher;
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'All teachers',
        data: teachers,
      };
    } catch (error) {
      throw error;
    }
  }

  async getStudents(): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Student[];
  }> {
    try {
      // get student from db
      let students = await this.prisma.student.findMany();
      // delete passwords
      students = students.map((student) => {
        delete student.password;
        return student;
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'All students',
        data: students,
      };
    } catch (error) {
      throw error;
    }
  }

  async getStudentByLogin(
    login: string,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Student;
  }> {
    try {
      // get student from db by login
      const student = await this.prisma.student.findUnique({
        where: { login },
        include: { mark: true },
      });
      // check if exists
      if (!student) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'Student is not fount',
        });
      }
      // delete password
      delete student.password;
      // return response
      return {
        status: 200,
        error: false,
        message: 'Available student',
        data: student,
      };
    } catch (error) {
      throw error;
    }
  }

  async createGroup(
    dto: GroupDto,
  ): Promise<{ status: number; error: boolean; message: string; data: Group }> {
    try {
      // insert data into db
      const group = await this.prisma.group.create({
        data: {
          ...dto,
        },
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'Group is added successfully',
        data: group,
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async editGroup(
    id: string,
    dto: GroupDto,
  ): Promise<{ status: number; error: boolean; message: string; data: Group }> {
    try {
      // get group from db
      const group = await this.prisma.group.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!group) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The group is not fount',
        });
      }
      // update it
      const updatedGroup = await this.prisma.group.update({
        where: { id },
        data: dto,
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Group is updated successfully',
        data: updatedGroup,
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteGroup(
    id: string,
  ): Promise<{ status: number; error: boolean; message: string; data: null }> {
    try {
      // get data from db
      const group = await this.prisma.group.findFirst({
        where: { id, deleted_at: null },
      });
      // check if exists
      if (!group) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The group is not fount',
        });
      }
      // soft delete if
      await this.prisma.group.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      // return response
      return {
        status: 200,
        error: false,
        message: 'Resource is deleted successfully',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async createSemester(
    dto: SemesterDto,
    admin,
  ): Promise<{
    status: number;
    error: boolean;
    message: string;
    data: Semester;
  }> {
    try {
      // check if the group has a semester like in dto
      const semester = await this.prisma.semester.findFirst({
        where: { name: dto.name, group_id: dto.group_id },
      });
      if (semester) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The semester is already exists for this group',
        });
      }
      // create semester
      const newSemester = await this.prisma.semester.create({
        data: {
          ...dto,
          admin_id: admin.id,
        },
      });
      // return response
      return {
        status: 201,
        error: false,
        message: 'Semester is added successfully',
        data: newSemester,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSemesterByDateAndName(
    name: string,
    date: Date,
  ): Promise<{ status: number; error: boolean; message: string; data: {} }> {
    try {
      // get semester
      const semester = await this.prisma.semester.findMany({
        where: {
          name,
          created_at: {
            gte: date,
          },
        },
        include: {
          group: true,
        },
      });
      // check if exists
      if (!semester) {
        throw new BadRequestException({
          status: 400,
          error: true,
          message: 'The semester for this group is not fount',
        });
      }
      // return response
      return {
        status: 200,
        error: false,
        message: 'Available semester of the group',
        data: semester,
      };
    } catch (error) {
      throw error;
    }
  }
}
