import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Projects,
  Project_accounts,
  Project_committee,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../services/prisma.service';
import { projectSelectedFields } from 'src/constants/fields';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  //** Projects */
  async fetchProjects(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectsWhereUniqueInput;
    where?: Prisma.ProjectsWhereInput;
    orderBy?: Prisma.ProjectsOrderByWithRelationInput;
  }): Promise<{ data: any; rowsCount: number }> {
    const {
      skip,
      take,
      // cursor,
      where,
      // orderBy,
    } = params;

    const data: any = await this.prisma.projects.findMany({
      skip,
      take,
      // cursor,
      where,
      orderBy: {
        date_time_added: 'desc',
      },
      select: projectSelectedFields,
      // select: {
      //   project_id: true,
      //   picture_1: true,
      //   picture_2: true,
      //   // picture_3: true,
      //   Project_accounts: true,
      // },
      // include: {
      // Project_reviews: true,
      // Project_committee: true,
      // Project_accounts: true,
      // Project_updates: true,
      // },
    });

    const rowsCount: number = await this.prisma.projects.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getProject(
    projectWhereUniqueInput: Prisma.ProjectsWhereUniqueInput,
  ): Promise<Projects> {
    const singleProject: any = await this.prisma.projects.findUnique({
      where: projectWhereUniqueInput,
      select: projectSelectedFields,
    });

    if (!singleProject)
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);

    return singleProject;
  }

  async createProject(data: Prisma.ProjectsCreateInput): Promise<any> {
    const createdData = await this.prisma.projects.create({
      data,
      select: projectSelectedFields,
    });
    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateProject(params: {
    where: Prisma.ProjectsWhereUniqueInput;
    data: Prisma.ProjectsUpdateInput;
  }): Promise<any> {
    const { where, data } = params;
    return this.prisma.projects.update({
      data,
      where,
      select: projectSelectedFields,
    });
  }

  async deleteProject(where: Prisma.ProjectsWhereUniqueInput): Promise<any> {
    return this.prisma.projects.delete({
      where,
      select: projectSelectedFields,
    });
  }

  //** Accounts */
  async fetchAccounts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.Project_accountsWhereUniqueInput;
    where?: Prisma.Project_accountsWhereInput;
    orderBy?: Prisma.Project_accountsOrderByWithRelationInput;
  }): Promise<{ data: Project_accounts[]; rowsCount: number }> {
    const {
      skip,
      take,

      where,
      // orderBy,
    } = params;

    const data: Project_accounts[] =
      await this.prisma.project_accounts.findMany({
        skip,
        take,
        // cursor,
        where,
        orderBy: {
          date_time_added: 'desc',
        },
      });

    const rowsCount: number = await this.prisma.project_accounts.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getAccount(
    accountWhereUniqueInput: Prisma.Project_accountsWhereUniqueInput,
  ): Promise<Project_accounts> {
    const singleAccount: Project_accounts | null =
      await this.prisma.project_accounts.findUnique({
        where: accountWhereUniqueInput,
      });

    if (!singleAccount)
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);

    return singleAccount;
  }

  async createAccount(
    data: Prisma.Project_accountsCreateInput,
  ): Promise<Project_accounts> {
    const createdData = await this.prisma.project_accounts.create({
      data,
    });

    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateAccount(params: {
    where: Prisma.Project_accountsWhereUniqueInput;
    data: Prisma.Project_accountsUpdateInput;
  }): Promise<Project_accounts> {
    const { where, data } = params;
    return this.prisma.project_accounts.update({
      data,
      where,
    });
  }

  async deleteAccount(
    where: Prisma.Project_accountsWhereUniqueInput,
  ): Promise<Project_accounts> {
    return this.prisma.project_accounts.delete({
      where,
    });
  }

  //** Committee */
  async fetchCommittee(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.Project_committeeWhereUniqueInput;
    where?: Prisma.Project_committeeWhereInput;
    orderBy?: Prisma.Project_committeeOrderByWithRelationInput;
  }): Promise<{ data: Project_committee[]; rowsCount: number }> {
    const { skip, take, where } = params;

    const data: Project_committee[] =
      await this.prisma.project_committee.findMany({
        skip,
        take,
        where,
        orderBy: {
          date_time_added: 'desc',
        },
      });

    const rowsCount: number = await this.prisma.project_committee.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getCommittee(
    accountWhereUniqueInput: Prisma.Project_committeeWhereUniqueInput,
  ): Promise<Project_committee> {
    const singleCommittee: Project_committee | null =
      await this.prisma.project_committee.findUnique({
        where: accountWhereUniqueInput,
      });

    if (!singleCommittee)
      throw new HttpException('Committee not found.', HttpStatus.NOT_FOUND);

    return singleCommittee;
  }

  async createCommittee(
    data: Prisma.Project_committeeCreateInput,
  ): Promise<Project_committee> {
    const createdData = await this.prisma.project_committee.create({
      data,
    });

    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateCommittee(params: {
    where: Prisma.Project_committeeWhereUniqueInput;
    data: Prisma.Project_committeeUpdateInput;
  }): Promise<Project_committee> {
    const { where, data } = params;
    return this.prisma.project_committee.update({
      data,
      where,
    });
  }
}
