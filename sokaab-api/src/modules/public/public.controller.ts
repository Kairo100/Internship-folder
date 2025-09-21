import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { format } from 'date-fns';

import { PublicService } from './public.service';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from 'src/services/prisma.service';
import { RecaptchaService } from 'src/services/recaptcha.service';
import { Public } from './../../middlewares/public.decorator';
import { isValidBase64Image, maskAccNo } from 'src/utils/otherUtils';
import { ZodValidationPipe } from 'src/validations/zod';
import {
  CheckAccountDto,
  CheckAccountSchema,
  DahabshiilServiceSchema,
  DahabshiilServiceDto,
  PaymentDto,
  PaymentSchema,
  PaystackDto,
  PaystackSchema,
  ProjectUpdateActivitytDto,
  ProjectUpdateActivitytSchema,
} from './dto';
import {
  checkEdahabPhoneNumber,
  checkWaafiPhoneNumber,
} from 'src/utils/phones';
import { FileInterceptor } from '@nestjs/platform-express';
import { platformEntity } from 'src/constants';

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Controller('public')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly projectsService: ProjectsService,
    private readonly prismaService: PrismaService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

  //** Projects **
  @Get('projects')
  @Public()
  async fetchProjects(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('date') date?: string,
    @Query() filters?: Record<string, string>, // Capture all filters as an object
  ) {
    // Pagination
    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    // Filters
    const where: Prisma.ProjectsWhereInput = {};
    where.AND = {
      AND: [
        {
          OR: [
            { status: { equals: 'Live' } },
            { status: { equals: 'live' } },
            { status: { equals: 'Active' } },
            { status: { equals: 'active' } },
          ],
        },
        { entity_id: platformEntity },
      ],
    };

    if (filters) {
      // Construct the 'where' object dynamically based on the received filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'category' && value) {
          where.category = value;
        } else if (key === 'status' && value) {
          // where.status = value;

          if (value === 'active') {
            where.end_date = {
              gte: new Date(),
            };
          } else if (value === 'implementation') {
            // where.implementation_start_date = { lte: new Date() };
            // where.implementation_end_date = { gte: new Date() };
          } else if (value === 'completed') {
            where.end_date = {
              lte: new Date(),
            };
          }
        } else if (key === 'region' && value) {
          where.country_region = value;
        }
        // Add more conditions for additional filter keys
      });
    }

    // Search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { category: { contains: search } },
        { community_name: { contains: search } },
        { country_region: { contains: search } },
        { location_district: { contains: search } },
        { village: { contains: search } },
        // Add more conditions for searching in other fields
      ];
    }
    //date
    if (date) {
      const parsedDate = new Date(`${date}T00:00:00.000Z`);

      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setUTCHours(0, 0, 0, 0); // Start of the filter day

        const endOfDay = new Date(parsedDate);
        endOfDay.setUTCHours(23, 59, 59, 999); // End of the filter day
        endOfDay.setUTCDate(parsedDate.getUTCDate() + 1);

        if (!where.AND || !Array.isArray(where.AND.AND)) {
          where.AND = { AND: [] };
        }
        (where.AND.AND as any[]).push({
          start_date: {
            lte: endOfDay, // Project must start ON
          },
          end_date: {
            gte: startOfDay, // Project must end ON
          },
        });
      } else {
        console.warn('Invalid date provided for filtering:', date);
      }
    }
    // Getting projects
    // const counts = await this.prismaService.projects.count({
    //   where,
    // });
    const projects = await this.prismaService.projects.findMany({
      // skip: parsedSkip,
      // take: parsedTake,
      where,
      select: {
        end_date: true,
        start_date: true,
        implementation_end_date: true,
        implementation_start_date: true,
        project_id: true,
        // picture_1: true,
        title: true,
        location_district: true,
        country_region: true,
        organisation_id: true,
        subtitle: true,
        description: true,
        category: true,
        available_grant: true,
        funding_goal: true,
        Project_accounts: {
          select: {
            AccNo: true,
          },
        },
      },
      orderBy: {
        // date_time_added: 'desc',
        country_region:'desc',
      },
    });

    // Getting the current project ID's
    const projectIDsArray = projects.map((project) => project.project_id);
    const projectsAccountsArray = projects.flatMap((project) =>
      project.Project_accounts.map((account) => account.AccNo),
    );

    // Getting transactions with targetted project accounts
    const transactions = await this.prismaService.receipts.findMany({
      where: {
        AccNo: {
          in: projectsAccountsArray,
        },
        CurrencyCode: 'USD',
        id: {
          notIn: [15655, 15654, 15653], // Don't showing transactions that are matching fund
        },
      },
      select: {
        AccNo: true,
        TranAmt: true,
        DrCr: true,
      },
    });

    // Getting the images with the list fo project IDs
    const projectImages = await this.prismaService.project_images.findMany({
      where: {
        project_id: {
          in: projectIDsArray,
        },
      },
      select: {
        project_id: true,
        url_1: true,
        url_2: true,
        url_3: true,
      },
    });

    // ** Re-arranging the full data to be sent
    // const projectsWithTransactions = await Promise.all(
    //   projects.map(async (project) => {
    //     // Extract project accounts from the current project
    //     const projectAccounts = project.Project_accounts;

    //     // Filter transactions based on the project accounts
    //     const projectTransactions = transactions.filter((transaction) =>
    //       projectAccounts.some(
    //         (account) => account.AccNo === transaction.AccNo,
    //       ),
    //     );

    //     // ** Calculations
    //     // 1- Getting the financial goal of the project
    //     // const goal =
    //     //   Number(project.available_grant) + Number(project.funding_goal);
    //     const goal = Number(project.funding_goal);

    //     // 2- Fundraise
    //     // Getting fundraise transaction
    //     const fundraiseTransactions = projectTransactions.filter(
    //       (transaction: any) =>
    //         transaction.DrCr.toLowerCase() == 'cr'.toLowerCase(),
    //     );
    //     //Calculating total fundraising for the project
    //     // const fundraised = projectTransactions.reduce((sum, transaction: any) => {
    //     //   return sum + Number(transaction.TranAmt);
    //     // }, 0);
    //     const fundraised = projectTransactions.reduce(
    //       (sum, transaction: any) => {
    //         return transaction.DrCr.toLowerCase() === 'cr'.toLowerCase()
    //           ? sum + parseFloat(transaction.TranAmt)
    //           : sum;
    //       },
    //       0,
    //     );

    //     // 3- Calculating total expenditure for the project
    //     const expenditure = projectTransactions.reduce(
    //       (sum, transaction: any) => {
    //         return transaction.DrCr.toLowerCase() === 'dr'.toLowerCase()
    //           ? sum + parseFloat(transaction.TranAmt)
    //           : sum;
    //       },
    //       0,
    //     );

    //     // 4- Getting total backers
    //     const backers = fundraiseTransactions.length;

    //     // 5- Calculating percentage raised for the project
    //     let percentageRaised: any =
    //       (Number(fundraised) / Number(goal)) * 100 || 0;
    //     percentageRaised =
    //       (Math.round(percentageRaised * 100) / 100).toFixed(2) || 0; // Rounding the number

    //     // 6- Getting images for every project
    //     const projectImagesForProject: any =
    //       projectImages.find((img) => img.project_id === project.project_id) ||
    //       {};

    //     const images = {
    //       url_1: projectImagesForProject?.url_1 || '',
    //       url_2: projectImagesForProject?.url_2 || '',
    //       url_3: projectImagesForProject?.url_3 || '',
    //     };

    //     // Getting the organization of the project
    //     const organization = await this.prismaService.organisations.findFirst({
    //       where: {
    //         organisation_id: Number(project.organisation_id),
    //       },
    //       select: {
    //         organisation_name: true,
    //         organisation_bio: true,
    //       },
    //     });

    //     return {
    //       ...project,
    //       transactions: projectTransactions,
    //       id: project.project_id,
    //       title: project.title,
    //       subtitle: project.subtitle,
    //       category: project.category,
    //       description: project.description,
    //       orgnanizationInfo: organization,
    //       images,
    //       goal,
    //       fundraised,
    //       expenditure,
    //       backers,
    //       percentageRaised,
    //     };
    //   }),
    // );



// Re-arranging the full data and adding calculated fields
// new logic and making somaliland regions first
  let projectsWithCalculations = projects.map((project) => {
    const projectAccounts = project.Project_accounts;
    const projectTransactions = transactions.filter((transaction) =>
      projectAccounts.some((account) => account.AccNo === transaction.AccNo),
    );

    const goal = Number(project.funding_goal);
    const fundraised = projectTransactions.reduce((sum, transaction: any) => {
      return transaction.DrCr.toLowerCase() === 'cr'.toLowerCase()
        ? sum + parseFloat(transaction.TranAmt)
        : sum;
    }, 0);

    const expenditure = projectTransactions.reduce(
      (sum, transaction: any) => {
        return transaction.DrCr.toLowerCase() === 'dr'.toLowerCase()
          ? sum + parseFloat(transaction.TranAmt)
          : sum;
      },
      0,
    );

    const backers = projectTransactions.filter(
      (transaction: any) => transaction.DrCr.toLowerCase() === 'cr'.toLowerCase(),
    ).length;

    let percentageRaised = (Number(fundraised) / Number(goal)) * 100 || 0;
    percentageRaised = parseFloat(percentageRaised.toFixed(2));

    const projectImagesForProject: any =
      projectImages.find((img) => img.project_id === project.project_id) || {};

    const images = {
      url_1: projectImagesForProject?.url_1 || '',
      url_2: projectImagesForProject?.url_2 || '',
      url_3: projectImagesForProject?.url_3 || '',
    };

    return {
      ...project,
      id: project.project_id,
      transactions: projectTransactions,
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      description: project.description,
      images,
      goal,
      fundraised,
      expenditure,
      backers,
      percentageRaised,
    };
  });

  // Applied  new filtering and sorting logic
  const now = new Date();

  let filteredAndSortedProjects = projectsWithCalculations
    .filter(project => {
      // You can add more filters here based on your new logic
      // For example, if you wanted to add a filter that only shows projects
      // with > 50% funding, you would do it here:
      // if (filters.someNewFilter === 'above50' && project.percentageRaised < 50) return false;
      return true; // Keep all projects unless a new filter is added
    })
    .sort((a, b) => {
      // Phase 1: Somaliland always comes first
      const aIsSomaliland = a.country_region === "Republic of Somaliland";
      const bIsSomaliland = b.country_region === "Republic of Somaliland";

      if (aIsSomaliland && !bIsSomaliland) return -1;
      if (!aIsSomaliland && bIsSomaliland) return 1;

      // Phase 2: Apply tier logic inside Somaliland and non-Somaliland separately
      const aEndDate = a.end_date ? new Date(a.end_date) : null;
      const bEndDate = b.end_date ? new Date(b.end_date) : null;

      const aIsActive = aEndDate ? aEndDate > now : false;
      const bIsActive = bEndDate ? bEndDate > now : false;

      const aPercentage = a.percentageRaised || 0;
      const bPercentage = b.percentageRaised || 0;
      const aAchieved50 = aPercentage >= 50;
      const bAchieved50 = bPercentage >= 50;
      const aReachedGoal = aPercentage >= 100;
      const bReachedGoal = bPercentage >= 100;

      // Tier 1: Active and >= 50%
      const aIsTier1 = aIsActive && aAchieved50;
      const bIsTier1 = bIsActive && bAchieved50;
      if (aIsTier1 && !bIsTier1) return -1;
      if (!aIsTier1 && bIsTier1) return 1;
      if (aIsTier1 && bIsTier1) return bPercentage - aPercentage;

      // Tier 2: Active and < 50%
      const aIsTier2 = aIsActive && !aAchieved50;
      const bIsTier2 = bIsActive && !bAchieved50;
      if (aIsTier2 && !bIsTier2) return -1;
      if (!aIsTier2 && bIsTier2) return 1;
      if (aIsTier2 && bIsTier2) return bPercentage - aPercentage;

      // Tier 3: Inactive
      const aIsTier3 = !aIsActive;
      const bIsTier3 = !bIsActive;
      if (aIsTier3 && bIsTier3) {
        // Priority: Fully funded > ≥50% > rest
        if (aReachedGoal && !bReachedGoal) return -1;
        if (!aReachedGoal && bReachedGoal) return 1;
        if (aAchieved50 && !bAchieved50) return -1;
        if (!aAchieved50 && bAchieved50) return 1;

        // If same group, sort by % raised
        return bPercentage - aPercentage;
      }

      return 0;
    });

  const counts = filteredAndSortedProjects.length;
  const paginatedProjects = filteredAndSortedProjects.slice(parsedSkip, parsedSkip + parsedTake);

 return { counts, list: paginatedProjects };
    // return { counts, list: projectsWithTransactions };
  }

  @Get('projects/:id')
  @Public()
  async getProject(@Param('id') projectID: number) {
    // Checking nature of the project id
    if (typeof Number(projectID) !== 'number')
      throw new HttpException(
        'The project you are requesting is not available',
        HttpStatus.BAD_REQUEST,
      );

    // Filters
    const where: Prisma.ProjectsWhereInput = {};
    where.AND = {
      project_id: Number(projectID),
      // status: 'Live', // ONLY ACTIVE PROJECTS
    };

    // Getting projects
    const currentProject = await this.prismaService.projects.findFirst({
      where,
      select: {
        project_id: true,

        title: true,
        subtitle: true,
        description: true,
        category: true,
        tags: true,
        story: true,

        community_name: true,
        village: true,
        location_district: true,
        country_region: true,
        latitude: true,
        longitude: true,

        // picture_1: true,
        // picture_2: true,
        // picture_3: true,

        available_grant: true,
        funding_goal: true,

        organisation_id: true,

        date_time_added: true,
        end_date: true,
        start_date: true,
        Project_updates: {
          where: {
            approved: true,
          },
          select: {
            update_title: true,
            description: true,
            picture_url: true,
            date_time_added: true,
          },
          orderBy: {
            date_time_added: 'desc',
          },
        },
        Project_accounts: {
          select: {
            AccNo: true,
            bankId: true,
          },
        },
        Project_committee: {
          select: {
            committee_name: true,
            committee_mobile_number: true,
            //added the position of the community person
            position_held: true,
          },
        },
      },
      orderBy: {
        date_time_added: 'desc',
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

    // Getting transactions with targetted project accounts
    let projectTransactions = await this.prismaService.receipts.findMany({
      where: {
        AccNo: {
          in: projectsAccountsArray,
        },
        CurrencyCode: 'USD',
        id: {
          notIn: [15655, 15654, 15653], // Don't showing transactions that are matching fund
        },
      },
      select: {
        AccNo: true,
        TranAmt: true,
        Narration: true,
        CustomerName: true,
        Category: true,
        DrCr: true,
        TranDate: true,
      },
      // orderBy: {
      //   TranDate: 'asc',
      // },
    });

    // Masking Account numbers
    projectTransactions = projectTransactions.map((item) => {
      let accMasked = maskAccNo(item.AccNo);
      accMasked = accMasked.slice(-7);

      let customerMasked = maskAccNo(item.CustomerName);
      customerMasked = customerMasked.slice(-6);

      let narrationMasked = item.Narration
        ? maskAccNo(item.Narration)
        : maskAccNo(item.CustomerName);
      narrationMasked = narrationMasked.slice(-6);

      return {
        ...item,
        AccNo: accMasked,
        CustomerName: customerMasked,
        Narration: narrationMasked,

        // AccNo: maskAccNo(item.AccNo),
        // CustomerName: maskAccNo(item.CustomerName),
        // Narration: item.Narration
        //   ? maskAccNo(item.Narration)
        //   : maskAccNo(item.CustomerName),

        // AccNo: item.AccNo,
        // CustomerName: item.CustomerName,
        // Narration: item.Narration,
      };
    });

    // Getting the images with the list fo project IDs
    const projectImages = await this.prismaService.project_images.findFirst({
      where: {
        project_id: Number(projectID),
      },
      select: {
        project_id: true,
        url_1: true,
        url_2: true,
        url_3: true,
      },
    });

    // Getting the organization of the project
    const organization = await this.prismaService.organisations.findFirst({
      where: {
        organisation_id: Number(currentProject.organisation_id),
      },
    });

    // ** Calculations
    // 1- Getting the financial goal of the project
    // const goal =Number(currentProject.available_grant) + Number(currentProject.funding_goal);
    const goal = Number(currentProject.funding_goal);

    // 2- Fundraise
    // Getting fundraise transaction
    const fundraiseTransactions = projectTransactions.filter(
      (transaction: any) =>
        transaction.DrCr.toLowerCase() == 'cr'.toLowerCase(),
    );

    // Getting the total fundraised for the project
    const fundraised = projectTransactions.reduce((sum, transaction: any) => {
      return transaction.DrCr.toLowerCase() == 'cr'.toLowerCase()
        ? sum + parseFloat(transaction.TranAmt)
        : sum;
    }, 0);

    // 3- Expenditure
    // Getting expenditure transactions
    const expenditureTransactions = projectTransactions.filter(
      (transaction: any) =>
        transaction.DrCr.toLowerCase() == 'dr'.toLowerCase(),
    );

    // Calculating total expenditure for the project
    const expenditure = projectTransactions.reduce((sum, transaction: any) => {
      return transaction.DrCr.toLowerCase() == 'dr'.toLowerCase()
        ? sum + parseFloat(transaction.TranAmt)
        : sum;
    }, 0);

    // 4- Getting total backers
    const backers = fundraiseTransactions.length;

    // 5- Calculating percentage raised for the project
    let percentageRaised: any = (Number(fundraised) / Number(goal)) * 100 || 0;
    percentageRaised =
      (Math.round(percentageRaised * 100) / 100).toFixed(2) || 0; // Rounding the number

    // 6- Getting images for every project
    const images = {
      url_1: projectImages?.url_1 || '',
      url_2: projectImages?.url_2 || '',
      url_3: projectImages?.url_3 || '',
    };

    return {
      ...currentProject,
      id: currentProject.project_id,
      organisation: organization?.organisation_name,
      organisation_bio: organization?.organisation_bio,
      images,
      goal,
      fundraised,
      expenditure,
      backers,
      percentageRaised,
      transactions: fundraiseTransactions,
      expenditureTransactions,
      org: organization,
    };
  }

  @Get('push-project-update-images-to-cloudinary')
  @Public()
  async convertProjectUpdateImages() {
    // Fetch the projects based on the given criteria
    const allProjects = await this.prismaService.projects.findMany({
      where: {
        // project_id: {
        //   in: [9, 8],
        // },
        // project_id: 10,
        entity_id: platformEntity,
      },
      select: {
        project_id: true,
      },
    });
    // console.log('~~~~~~~~~~~~~~~~~~~~~~~~      ', allProjects);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~      ', allProjects.length);
    // return '';

    if (allProjects.length === 0) {
      return 'No Projects';
    } else {
      // Iterate over each project to fetch and process updates
      for (const project of allProjects) {
        console.log(
          '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ P-ID: ',
          project.project_id,
        );
        // Fetch the updates for each project
        const imageFromDatabase =
          await this.prismaService.project_updates.findMany({
            where: {
              project_id: project.project_id, // Use the project_id from the current project
            },
            select: {
              update_id: true,
              picture: true,
              project_id: true,
            },
          });

        // Process each update
        for (const update of imageFromDatabase) {
          if (update && update.picture) {
            console.log('###### ', update.update_id);
            const imageBuffer = Buffer.from(update.picture);

            const validImageBuffer = await isValidBase64Image(imageBuffer);
            if (validImageBuffer) {
              console.log('@@@@@@  -----  Yeeeees it has image buffer');
              // Convert buffer to base64
              const base64Image = imageBuffer.toString('base64');
              // console.log('&&&&&& 4', base64Image);
              const dataUri = `data:image/jpeg;base64,${base64Image}`;

              // Upload the image to Cloudinary
              const result = await cloudinary.uploader.upload(dataUri, {
                folder: `Sokaab/${update.project_id}/project_images/`,
              });

              // console.log('****', update);
              // console.log('*******', result);

              // Update the database with the URL of the uploaded image
              const updatedProjectUpdate =
                await this.prismaService.project_updates.update({
                  where: { update_id: update.update_id },
                  data: {
                    picture_url: result.secure_url,
                  },
                  select: {
                    // picture_url: true,
                    // project_id: true,
                    update_id: true,
                  },
                });
              // return updatedProjectUpdate;

              console.log(
                `Updated project update with id: ${updatedProjectUpdate.update_id}`,
              );
            }
          }
        }
      }

      return 'yesss man';
    }
  }

  @Get('push-project-images-to-cloudinary')
  @Public()
  async convertProjectImages() {}

  @Get('project-maps')
  @Public()
  async fetchProjectMaps() {
    // Filters
    const where: Prisma.ProjectsWhereInput = {};
    where.AND = {
      // status: 'Live',
      entity_id: platformEntity,
    };

    const projects = await this.prismaService.projects.findMany({
      where,
      select: {
        project_id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        start_date: true,
        end_date: true,
        available_grant: true,
        funding_goal: true,
        latitude: true,
        longitude: true,
      },
      orderBy: {
        date_time_added: 'desc',
      },
    });

    return projects;
  }

  @Put('projects/:id/update-activity')
  @Public()
  @UseInterceptors(FileInterceptor('picture'))
  async UpdateProjectActivity(
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(ProjectUpdateActivitytSchema))
    projectUpdateActivitytDto: ProjectUpdateActivitytDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    // Verify reCAPTCHA first
    await this.recaptchaService.verifyRecaptcha(
      projectUpdateActivitytDto.recaptcha,
    );

    const parsedBody = ProjectUpdateActivitytSchema.omit({
      picture: true,
      recaptcha: true,
    }).parse(projectUpdateActivitytDto);

    const createdProjectUpdate =
      await this.prismaService.project_updates.create({
        data: {
          project_id: Number(projectID),
          update_title: parsedBody.title,
          description: parsedBody.description,
          added_by: 'PUBLIC',
        },
      });

    if (!createdProjectUpdate)
      throw new HttpException(
        'Failed to add the update. Try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const pictureCloudinary: CloudinaryResponse = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `Sokaab/${projectID}/project_images` },
            (error: any, result: any) => {
              if (error) reject(error);
              resolve(result);
            },
          )
          .end(picture.buffer);
      },
    );

    if (pictureCloudinary) {
      const updatedProjectUpdate =
        await this.prismaService.project_updates.update({
          where: { update_id: createdProjectUpdate.update_id },
          data: { picture_url: pictureCloudinary?.url },
        });

      if (!updatedProjectUpdate)
        throw new HttpException(
          'Failed to add the update. Try again later!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      return 'Succesfully Added the update';
    } else {
      await this.prismaService.project_updates.delete({
        where: { update_id: createdProjectUpdate.update_id },
      });
      throw new HttpException(
        'Failed to upload the image. Try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ** Payment Gateway **
  @Post('payment/checkAccount')
  @Public()
  async checkAccount(
    @Body(new ZodValidationPipe(CheckAccountSchema))
    checkAccountDto: CheckAccountDto,
  ) {
    // Checking nature of the project id
    if (typeof Number(checkAccountDto.project_id) !== 'number')
      throw new HttpException(
        'The project you are requesting is not available',
        HttpStatus.BAD_REQUEST,
      );

    const account = await this.prismaService.project_accounts.findFirst({
      where: {
        project_Id: checkAccountDto.project_id,
        bankId: checkAccountDto.bank,
      },
    });

    if (!account)
      throw new HttpException(
        `This project does not have ${checkAccountDto.bank}`,
        HttpStatus.NOT_FOUND,
      );

    return account;
  }

  @Post('payment/donate')
  @Public()
  async Payment(
    @Body(new ZodValidationPipe(PaymentSchema))
    paymentDto: PaymentDto,
    @Res() response,
  ) {
    // Checking nature of the project id
    if (typeof Number(paymentDto.project_id) !== 'number')
      throw new HttpException(
        'The project you are requesting is not available',
        HttpStatus.BAD_REQUEST,
      );

    await this.projectsService.getProject({
      project_id: Number(paymentDto.project_id),
    });

    // 1- Waafi Service
    if (paymentDto.service.toLocaleLowerCase() === 'waafi') {
      const validWaafiNumber = checkWaafiPhoneNumber(paymentDto.phone);
      if (!validWaafiNumber)
        throw new HttpException(
          `This is not a valid ${paymentDto.bank} mobile number`,
          HttpStatus.BAD_REQUEST,
        );
      return this.publicService.payWaafi(paymentDto, response);
    }

    // 2- Edahab Service
    if (paymentDto.service.toLocaleLowerCase() === 'edahab') {
      const validEdahabNumber = checkEdahabPhoneNumber(paymentDto.phone);
      if (!validEdahabNumber)
        throw new HttpException(
          // 'Edahab shoud start with  25265, 25266, 25262, or 25264',
          `This is not a valid ${paymentDto.bank} mobile number`,
          HttpStatus.BAD_REQUEST,
        );
      return this.publicService.payEdahab(paymentDto, response);
    }
  }

  @Get('payment/check-edahab-invoice/:project_id/:invoice_id')
  @Public()
  checkEdahabInvoice(
    @Param('project_id') project_id: string,
    @Param('invoice_id') invoice_id: string,
    @Res() response,
  ): any {
    this.publicService.checkEdahabInvoice(project_id, invoice_id, response);
    return 'yesss';
  }

  @Post('payment/paystack')
  @Public()
  async DonateWithPaystack(
    @Body(new ZodValidationPipe(PaystackSchema))
    paystackDto: PaystackDto,
    @Res() response,
  ) {
    // Checking nature of the project id
    if (typeof Number(paystackDto.project_id) !== 'number')
      throw new HttpException(
        'The project you are requesting is not available',
        HttpStatus.BAD_REQUEST,
      );

    await this.projectsService.getProject({
      project_id: Number(paystackDto.project_id),
    });

    // Handling payment with paystack
    return this.publicService.payWithPaystack(paystackDto, response);
  }

  @Get('payment/verifyPaystack/:reference')
  @Public()
  verifyPaystackDonation(
    @Param('reference') reference: string,
    @Res() response,
  ): any {
    if (!reference)
      throw new HttpException(
        'You need to provide a reference',
        HttpStatus.BAD_REQUEST,
      );
    // this.publicService.checkEdahabInvoice(project_id, invoice_id, response);
    return this.publicService.verifyingPaystackPayment(reference, response);
  }

  @Post('payment/services')
  async dahabshiilService(
    @Body(new ZodValidationPipe(DahabshiilServiceSchema))
    dahabshiilServiceDto: DahabshiilServiceDto,
    @Res() response,
  ) {
    const account = await this.prismaService.project_accounts.findFirst({
      where: {
        AccNo: dahabshiilServiceDto.accountNo,
      },
    });

    if (!account)
      throw new HttpException(
        `This project does not have ${dahabshiilServiceDto.accountNo}`,
        HttpStatus.NOT_FOUND,
      );

    // Check for duplicate transaction number
    const existingTransaction = await this.prismaService.receipts.findFirst({
      where: {
        TranNo: dahabshiilServiceDto.transactionNo,
      },
    });

    if (existingTransaction) {
      throw new HttpException(
        `Transaction with number ${dahabshiilServiceDto.transactionNo} already exists.`,
        HttpStatus.CONFLICT,
      );
    }

    const createdAt = format(
      dahabshiilServiceDto.transactionDate,
      'M/dd/yyyy h:mm:ss a',
    );

    try {
      await this.prismaService.receipts.create({
        data: {
          TranDate: String(createdAt),
          TranNo: dahabshiilServiceDto.transactionNo,
          TranAmt: dahabshiilServiceDto.transactionAmount,
          AccNo: dahabshiilServiceDto.accountNo,
          CustomerName: dahabshiilServiceDto.donarName,
          Narration: dahabshiilServiceDto.narration,
          ChargeAmount: dahabshiilServiceDto.chargedAmount,
          TranType: dahabshiilServiceDto.transactionType,
          DrCr: dahabshiilServiceDto.drcr,
          CurrencyCode: dahabshiilServiceDto.currency,
          UTI: dahabshiilServiceDto.uti,
          Category: 'DAHABSHIIL BANK',
          UserID: 'SYS',
        },
      });
      return response.status(200).send({
        statusCode: '200',
        messsage: 'Transaction has been added successfully',
      });
    } catch (err) {
      throw new HttpException(
        'Transaction was not successfully added',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
  
}
