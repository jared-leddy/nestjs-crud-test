// NPM Modules
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

// Custom Modules
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService ,private jwt: JwtService, private prisma: PrismaService) {}
  
  async login(dto: AuthDTO){
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
    // if user does not exist, throw error
    if (!user) throw new ForbiddenException('User does not exist.');
    // if user exists, check password 
    const passwordMatch = await argon.verify(user.hash, dto.password)
    // if password doesn't match, throw error
    if (!passwordMatch) throw new ForbiddenException('Password is not correct.');

    return this.signToken(user.id, user.email);
  }

  async register(dto: AuthDTO) {
    try {
      // get hashed password 
      const hash = await argon.hash(dto.password);
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists.');
        }
      }
      throw error;
    }
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret
    })
    return {
      access_token: token
    }
  }
}
