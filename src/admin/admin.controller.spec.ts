import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { async } from 'rxjs';
import { AdminJwtGuard } from 'src/auth/guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;

  const mockAdminService = {
    addTeacherGroups: jest.fn((dto) => {
      return {
        status: 200,
        error: false,
        message: 'success',
        data: {},
      };
    }),

    editTeacherGroups: jest.fn().mockImplementation((dto) => {
      return {
        status: 200,
        error: false,
        message: 'updated',
        data: {},
      };
    }),
  };
  // let request: Request = {} as unknown as Request

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService],
    })
      .overrideProvider(AdminService)
      .useValue(mockAdminService)
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('add-group-teacher', async () => {
    const dto = { teacher_id: 'id', group_id: 'id' };

    expect(await controller.addGroupTeacher(dto)).toEqual({
      status: 200,
      error: false,
      message: 'success',
      data: {},
    });
  });

  it('should edit teacher group', async () => {
    const dto = { group_id: 'aaaaa' };

    expect(await controller.editTeacherGroup('1', 'a', dto)).toEqual({
      status: 200,
      error: false,
      message: 'updated',
      data: {},
    });
  });
});
