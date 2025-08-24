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

    if (loggedInUser.user_type === 'organisation_member') {
      // Return organization member data
      const member = await this.prismaService.organisation_members.findFirst({
        where: { member_id: loggedInUser.id },
      });

      if (!member) throw new UnauthorizedException('User not found');

      const organization = await this.prismaService.organisations.findFirst({
        where: { organisation_id: member.organisation_id || undefined },
      });

      return {
        ...member,
        organisation: organization,
        user_type: 'organisation_member',
      };
    } else {
      // Return user account data
      return this.usersService.getUser({ user_id: loggedInUser.id });
    }
  }

  @Post('login')
  @Public()
  @UsePipes(new ZodValidationPipe(AuthLoginSchema))
  async login(@Body() authLoginDto: AuthLoginDto) {
    const { email, password, user_type } = authLoginDto;

    if (user_type === 'organisation_member') {
      // Handle organisation member login
      const currentMember =
        await this.prismaService.organisation_members.findFirst({
          where: { email_address: email },
        });

      if (!currentMember)
        throw new UnauthorizedException('Invalid credentials');

      // Compare password
      if (currentMember.password) {
        const passwordMatch = await compare(password, currentMember.password);
        if (!passwordMatch)
          throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
          );
      } else {
        throw new HttpException(
          'Account not properly configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Get organization details
      const organization = await this.prismaService.organisations.findFirst({
        where: { organisation_id: currentMember.organisation_id || undefined },
      });

      if (!organization) {
        throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
      }

      // Generate JWT token for organization member
      const userInfoTobeSent = {
        id: currentMember.member_id,
        full_name: currentMember.full_name,
        email: currentMember.email_address,
        user_type: 'organisation_member',
        organisation_id: currentMember.organisation_id,
        organisation_name: organization.organisation_name,
        position_held: currentMember.position_held,
      };

      const generatedToken = await this.jwtService.signAsync(userInfoTobeSent);

      return {
        access_token: generatedToken,
        userData: userInfoTobeSent,
      };
    } else {
      // Handle user account login (existing logic)
      const currentUser = await this.prismaService.user_accounts.findFirst({
        where: { email_address: email },
      });

      if (!currentUser) throw new UnauthorizedException('Invalid credentials');

      // Compare password
      if (currentUser.password) {
        const passwordMatch = await compare(password, currentUser.password);
        if (!passwordMatch)
          throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
          );
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Generate JWT token for user account
      const userInfoTobeSent = {
        id: currentUser.user_id,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        email: currentUser.email_address,
        user_type: 'user_account',
        account_type: currentUser.account_type,
      };

      const generatedToken = await this.jwtService.signAsync(userInfoTobeSent);

      return {
        access_token: generatedToken,
        userData: userInfoTobeSent,
      };
    }
  }
}
