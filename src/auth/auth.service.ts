import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    singToken(id: string, name: string ): Promise<string> {
        return this.jwt.signAsync({ id, name }, {
            secret: this.config.get("SECRET_KEY")
        })
    }
}
