import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpException,
  HttpStatus,
  Query,
  Put,
  // Req,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { omit } from 'lodash';
import { hash } from 'bcrypt';

import { UsersService } from './users.service';
import {
  CreateUserSchema,
  CreateUserDto,
  UpdateUserSchema,
  UpdateUserDto,
} from './dto/dtos';
import { ZodValidationPipe } from 'src/validations/zod';
import { PrismaService } from 'src/services/prisma.service';

@Controller('users')
export class UsersController {
  private readonly hashSalt = 10;
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  // @Public()
  async fetchUsers(
    // @Req() request,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    // @Query() filters?: Record<string, string>, // Capture all filters as an object
  ) {
    // const { user: loggedInUser } = request; // Getting logged in user
    const where: Prisma.User_accountsWhereInput = {};

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    if (search) {
      where.OR = [
        { user_id: { contains: search } },
        { first_name: { contains: search } },
        { last_name: { contains: search } },
        { email_address: { contains: search } },
        { title: { contains: search } },
        { account_type: { contains: search } },
        { User_organisation: { contains: search } },
        // Add more conditions for searching in other fields
      ];
    }

    const users = await this.usersService.fetchUsers({
      skip: parsedSkip,
      take: parsedTake,
      where,
    });

    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') userID: string) {
    return this.usersService.getUser({ user_id: userID });
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async createUser(@Body() createUserData: CreateUserDto) {
    // Checking email uniqueness
    const emailExistance = await this.prismaService.user_accounts.findFirst({
      where: { email_address: createUserData.email_address },
    });
    if (emailExistance)
      throw new HttpException(
        'Email address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Hashing password
    const hashedPassword = await hash(createUserData.password, this.hashSalt);

    const dataInput: Prisma.User_accountsCreateInput = {
      ...omit(createUserData, ['confirm_password']),
      password: hashedPassword,
      user_id: uuidv4(),
      added_by: 'admin',
      date_time_added: new Date(),
    };

    const createdData = await this.usersService.createUser(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') userID: string,
    @Body(new ZodValidationPipe(UpdateUserSchema))
    updateUserData: UpdateUserDto,
  ) {
    // Checking if the user exists
    const currentUser = await this.usersService.getUser({ user_id: userID });

    // Checking email uniqueness
    if (currentUser.email_address !== updateUserData.email_address) {
      const emailExistance = await this.prismaService.user_accounts.findFirst({
        where: { email_address: updateUserData.email_address },
      });
      if (emailExistance)
        throw new HttpException(
          'This email address is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const dataInput: Prisma.User_accountsUpdateInput = {
      ...omit(updateUserData, ['confirm_password']),
    };

    // Hashing password
    if (updateUserData.password) {
      const hashedPassword = await hash(updateUserData.password, this.hashSalt);
      dataInput.password = hashedPassword;
    }

    const updatedData = await this.prismaService.user_accounts.update({
      where: { user_id: userID },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') userID: string) {
    // Checking if the user exists
    await this.usersService.getUser({
      user_id: userID,
    });

    const deletedUser = this.usersService.deleteUser({
      user_id: userID,
    });

    return {
      statusCode: 200,
      message: 'Data successfully deleted',
      data: deletedUser,
    };
  }
}
