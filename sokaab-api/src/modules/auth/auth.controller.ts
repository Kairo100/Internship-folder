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
  //added
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { AuthService } from './auth.service';
import { AuthLoginSchema, AuthLoginDto } from './dto';
import { PrismaService } from 'src/services/prisma.service';
import { ZodValidationPipe } from 'src/validations/zod';
import { Public } from 'src/middlewares/public.decorator';

//things to be added
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { hash } from 'bcrypt';


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

// added
 // ✅ Forgot password (works for both)
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body('email') email: string) {
    const user = await this.prismaService.user_accounts.findFirst({ where: { email_address: email } });
    const orgMember = await this.prismaService.organisation_members.findFirst({ where: { email_address: email } });

    if (!user && !orgMember) throw new BadRequestException('No account found with this email');

    const resetToken = await this.jwtService.signAsync({ email }, { expiresIn: '15m' });

   const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // smtp.ethereal.email
  port: Number(process.env.SMTP_PORT),  // 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


    await transporter.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: 'Password Reset',
  text: `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`, // fallback plain text
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password:</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}"
           style="background:#00CC99;color:#fff;padding:10px 15px;
                  text-decoration:none;border-radius:5px;display:inline-block;">
          Reset Password
        </a>
      </p>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
        ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}
      </a></p>
    </div>
  `,
});


    return { message: 'Reset link sent to your email' };
  }

  // ✅ Reset password
  @Post('reset-password')
  @Public()
  async resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      const email = decoded.email;
      const hashedPassword = await hash(newPassword, 10);

      const userUpdate = await this.prismaService.user_accounts.updateMany({
        where: { email_address: email },
        data: { password: hashedPassword },
      });

      const orgUpdate = await this.prismaService.organisation_members.updateMany({
        where: { email_address: email },
        data: { password: hashedPassword },
      });

      if (userUpdate.count === 0 && orgUpdate.count === 0) {
        throw new BadRequestException('No account found to reset');
      }

      return { message: 'Password reset successful' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}




