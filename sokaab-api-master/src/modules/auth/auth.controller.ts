import { UsersService } from './../users/users.service';
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  HttpException,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { AuthService } from './auth.service';
import { AuthLoginSchema, AuthLoginDto } from './dto';
import { PrismaService } from 'src/services/prisma.service';
import { ZodValidationPipe } from 'src/validations/zod';
import { Public } from 'src/middlewares/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('me')
  async getUserById(@Req() request) {
    const { user: loggedInUser } = request;

    return this.usersService.getUser({ user_id: loggedInUser.id });
  }

  @Post('login')
  @Public()
  @UsePipes(new ZodValidationPipe(AuthLoginSchema))
  async login(@Body() authLoginDto: AuthLoginDto) {
    // Checking if user existance
    const currentUser = await this.prismaService.user_accounts.findFirst({
      where: { email_address: authLoginDto.email },
    });
    if (!currentUser) throw new UnauthorizedException('Invalid credentials');

    // Compare the provided password with the stored hashed password
    if (currentUser.password) {
      const passwordMatch = await compare(
        authLoginDto.password,
        currentUser.password,
      );
      if (!passwordMatch)
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    } else
      throw new HttpException(
        'Interal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    // Generating JWT token from the current user
    const userInfoTobeSent = {
      id: currentUser.user_id,
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      email: currentUser.email_address,
    };
    const generatedToken = await this.jwtService.signAsync(userInfoTobeSent);

    return {
      access_token: generatedToken,
      userData: userInfoTobeSent,
    };
  }
}
