import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AdminDto, EditAdminDto } from './dto';
import { SuperJwtGuard } from 'src/auth/guard';
import { SuperAdminService } from './super-admin.service';
import { myStorage } from 'src/helper';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('super-admin')
@Controller('super-admin')
export class SuperAdminController {
  constructor(private superService: SuperAdminService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  @UseGuards(SuperJwtGuard)
  getMe(@Req() req: Request) {
    return { status: 200, message: "Personal info", data: req.user };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @Post('add-admin')
  @UseGuards(SuperJwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: myStorage,
    }),
  )
  async addAdmin(
    @Body() dto: AdminDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.superService.addAdmin(dto, file, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Patch('edit-admin')
  @UseGuards(SuperJwtGuard)
  async editAdmin(
    @Query('id', ParseUUIDPipe) id: string,
    @Body() dto: EditAdminDto,
    @Req() req: Request,
  ) {
    return this.superService.editAdmin(dto, id, req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete('delete-admin')
  @UseGuards(SuperJwtGuard)
  async deleteAdmin(@Query('id', ParseUUIDPipe) id: string) {
    return this.superService.deleteAdmin(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get('admins')
  @UseGuards(SuperJwtGuard)
  async getAdmins() {
    return this.superService.getAdmins();
  }
}
