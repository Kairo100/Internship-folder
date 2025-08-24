import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from 'src/services/prisma.service';
import { Public } from 'src/middlewares/public.decorator';
import { platformEntity } from 'src/constants';
// import { projectSelectedFields } from 'src/constants/fields';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly projectsService: ProjectsService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('projects/:id')
  @Public()
  async getProjectStatistics(@Param('id') projectId: number) {
    // Checking if the project exists
    // const currentProject = await this.projectsService.getProject({
    //   project_id: Number(projectId),
    // });

    const currentProject = await this.prismaService.projects.findFirst({
      where: {
        project_id: Number(projectId),
      },
      select: {
        available_grant: true,
        funding_goal: true,
        project_value: true,
        Project_accounts: {
          select: {
            AccNo: true,
            bankId: true,
          },
        },
      },
    });

    if (!currentProject)
      throw new HttpException(
        'The project you are requesting is not available',
        HttpStatus.BAD_REQUEST,
      );

    // Extracting project accounts
    const projectsAccountsArray = currentProject.Project_accounts.map(
      (account) => account.AccNo,
    );

    console.log('------', projectsAccountsArray);
    // Getting the receipts/transactions for the specific project accouonts
    const pojectTransactions = await this.prismaService.receipts.findMany({
      where: {
        AccNo: {
          in: projectsAccountsArray,
        },
        CurrencyCode: 'USD',
      },
      select: {
        AccNo: true,
        TranAmt: true,
        DrCr: true,
      },
    });

    // 2- Funraise
    // Getting the fundraise transactions
    const fundraiseTransactions = pojectTransactions.filter(
      (transaction: any) =>
        transaction.DrCr.toLowerCase() === 'cr'.toLowerCase(),
    );

    //Getting the total fund raised for this project
    const totalFundRaised = pojectTransactions.reduce(
      (sum, transaction: any) => {
        // return sum + Number(transaction.TranAmt);
        return transaction.DrCr.toLowerCase() === 'cr'.toLowerCase()
          ? sum + parseFloat(transaction.TranAmt)
          : sum;
      },
      0,
    );

    // 2- Getting the total expenditure
    const totalExpenditure = pojectTransactions.reduce(
      (sum, transaction: any) => {
        if (transaction.DrCr.toLowerCase() === 'dr'.toLowerCase())
          return sum + Number(transaction.TranAmt);
        return sum;
      },
      0,
    );

    // 3- Getting the total project backers
    const backers = fundraiseTransactions.length;

    const data = {
      fundingGoal: currentProject.funding_goal, // Community money
      matchingFund: currentProject.available_grant, // Aslo called available grant... Money given to community by organization
      projectValue: currentProject.project_value, // projectValue = funding goal + matchingFund/available_grant
      backers,
      fundRaised: totalFundRaised,
      expenditure: totalExpenditure,
    };

    return data;
  }

  @Get('dashboard')
  @Public()
  async getDashboardStatistics() {
    // ** Dealing with project side
    const projects: any = await this.prismaService.projects.findMany({
      where: {
        entity_id: platformEntity,
      },
      select: {
        status: true,
        funding_goal: true,
        available_grant: true,
        project_value: true,
        Project_accounts: {
          select: {
            AccNo: true,
          },
        },
      },
    });

    // Getting the projects accounts
    const projectsAccountsArray = projects.flatMap((project) =>
      project.Project_accounts.map((account) => account.AccNo),
    );

    // 1- Getting the total funding goal
    const fundingGoals = projects.reduce((sum: number, project) => {
      return sum + Number(project.funding_goal);
    }, 0);

    // 2- Getting the total matching funds
    const matchingFunds = projects.reduce((sum: number, project) => {
      return sum + Number(project.available_grant);
    }, 0);

    // 3- Getting the total project values
    const projectValues = projects.reduce((sum: number, project: any) => {
      return sum + Number(project?.project_value);
    }, 0);

    // 4- Getting the active projects
    const activeProjects = projects.filter(
      (project) => project.status.toLowerCase() === 'Live'.toLowerCase(),
    ).length;

    // 5- Getting the pending projects
    const pendingProjects = projects.filter(
      (project) => project.status.toLowerCase() === 'Pending'.toLowerCase(),
    ).length;

    // 6- Getting the inactive projects
    // const inactiveProjects = projects.filter(
    //   (project) => project.status.toLowerCase() === 'inactive'.toLowerCase(),
    // ).length;

    // ** Dealing with tranactions side
    // Getting all receipts/transactions
    const pojectTransactions = await this.prismaService.receipts.findMany({
      where: {
        AccNo: {
          in: projectsAccountsArray,
        },
        CurrencyCode: 'USD',
      },
      select: {
        AccNo: true,
        TranAmt: true,
        DrCr: true,
      },
    });

    // 1- Fundraise
    // Getting the fundraise transactions
    const fundraiseTransactions = pojectTransactions.filter(
      (transaction: any) =>
        transaction.DrCr.toLowerCase() === 'cr'.toLowerCase(),
    );

    // Getting the total fund raised
    const fundRaised = pojectTransactions.reduce((sum, transaction: any) => {
      // return sum + Number(transaction.TranAmt);
      return transaction.DrCr.toLowerCase() === 'cr'.toLowerCase()
        ? sum + parseFloat(transaction.TranAmt)
        : sum;
    }, 0);

    // 2- Getting the total expenditure
    const expenditure = pojectTransactions.reduce((sum, transaction: any) => {
      if (transaction.DrCr.toLowerCase() === 'dr'.toLowerCase())
        return sum + Number(transaction.TranAmt);
      return sum;
    }, 0);

    // 3- Getting total backers
    const backers = fundraiseTransactions.length;

    return {
      fundingGoals,
      matchingFunds,
      projectValues,
      fundRaised,
      expenditure,
      backers,
      totalProjects: projects.length,
      activeProjects,
      pendingProjects,
      // inactiveProjects: 2,
      // a: fundRaised - matchingFunds,
    };
  }

  @Get('dashboard1')
  @Public()
  async yyyyyy() {
    const projects: any = await this.prismaService.projects.findMany({
      select: {
        status: true,
        funding_goal: true,
        available_grant: true,
        project_value: true,
      },
    });

    return projects;
  }
}
