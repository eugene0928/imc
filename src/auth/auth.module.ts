import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SuperJwtStrategy, AdminJwtStrategy, TeacherJwtStrategy, StudentJwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, SuperJwtStrategy, AdminJwtStrategy, TeacherJwtStrategy, StudentJwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
