import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User_accounts, Prisma } from '@prisma/client';

import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async fetchUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.User_accountsWhereUniqueInput;
    where?: Prisma.User_accountsWhereInput;
    orderBy?: Prisma.User_accountsOrderByWithRelationInput;
  }): Promise<{ data: User_accounts[]; rowsCount: number }> {
    const {
      skip,
      take,
      // cursor,
      where,
      // orderBy,
    } = params;

    const data: any[] = await this.prisma.user_accounts.findMany({
      skip,
      take,
      // cursor,
      where,
      orderBy: {
        date_time_added: 'desc',
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email_address: true,
        title: true,
        date_time_added: true,
        account_type: true,
      },
    });

    const rowsCount: number = await this.prisma.user_accounts.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getUser(
    userWhereUniqueInput: Prisma.User_accountsWhereUniqueInput,
  ): Promise<User_accounts> {
    const singleUser: User_accounts | null =
      await this.prisma.user_accounts.findUnique({
        where: userWhereUniqueInput,
      });

    if (!singleUser)
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    return singleUser;
  }

  async createUser(
    data: Prisma.User_accountsCreateInput,
  ): Promise<User_accounts> {
    const createdData = await this.prisma.user_accounts.create({
      data,
    });
    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateUser(params: {
    where: Prisma.User_accountsWhereUniqueInput;
    data: Prisma.User_accountsUpdateInput;
  }): Promise<User_accounts> {
    const { where, data } = params;
    return this.prisma.user_accounts.update({
      data,
      where,
    });
  }

  async deleteUser(
    where: Prisma.User_accountsWhereUniqueInput,
  ): Promise<User_accounts> {
    return this.prisma.user_accounts.delete({
      where,
    });
  }
}
