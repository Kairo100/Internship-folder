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
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import {
  CreateProjectSchema,
  CreateProjectDto,
  UpdateProjectSchema,
  UpdateProjectDto,
  UpdateProjectStorySchema,
  UpdateProjectStoryDto,
  CreateProjectAccountSchema,
  CreateProjectAccountDto,
  CreateProjectCommitteeSchema,
  CreateProjectCommitteeDto,
  UpdateProjectCommitteeSchema,
  UpdateProjectCommitteeDto,
  UpdateProjectStatusSchema,
  UpdateProjectStatusDto,
  ApproveProjectUpdateDto,
  ApproveProjectUpdateSchema,
  ProjectImagesSchema,
  ProjectImagesDto,
  SearchFilterDto,
  searchFilterSchema,
  CreateProjectDocumentDto, // <--- ADD THIS
  CreateProjectDocumentSchema, // <--- ADD THIS
 

} from './dto/dtos';
import { ZodValidationPipe } from 'src/validations/zod';
import { PrismaService } from 'src/services/prisma.service';
// import { convertReadStreamToBuffer } from 'src/utils/imageUtils';
import { platformEntity } from 'src/constants';
import {
  categoryOptions,
  endMethodOptions,
  regionStatesWithDistricts,
} from 'src/constants/data';
import { Public } from 'src/middlewares/public.decorator';
import { CloudinaryService } from 'src/services/cloudinary.service';

// const storage = {
//   storage: diskStorage({
//     // destination: 'uploads/images', // If you saving the image locally... uncomment this
//     filename: (req, file, cb) => {
//       const filename: string = 'myfile-' + randomUUID();
//       const extension: string = parse(file.originalname).ext;
//       cb(null, `${filename}${extension}`);
//     },
//   }),
// };

// type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //** Projects */
  @Get()
  async fetchProjects(
    @Req() request,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    // @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    // @Query('orderBy') orderBy?: string,
    @Query() filters?: Record<string, string>, // Capture all filters as an object
  ) {
    const { user: loggedInUser } = request;
    const where: Prisma.ProjectsWhereInput = {};

    // Base filtering by entity
    where.AND = {
      entity_id: platformEntity,
    };

    // If user is an organization member, filter by their organization
    if (
      loggedInUser?.user_type === 'organisation_member' &&
      loggedInUser?.organisation_id
    ) {
      where.AND = {
        ...where.AND,
        organisation_id: loggedInUser.organisation_id,
      };
    }

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

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

    if (filters) {
      // Construct the 'where' object dynamically based on the received filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'category' && value) {
          where.category = value;
        } else if (key === 'status' && value) {
          where.status = value;
        }  else if (key === 'region' && value) {
          where.country_region = value;
        } 
        else if (key === 'dateFrom' && value) { // Add logic for dateFrom
        // Ensure the `AND` condition exists
        where.AND = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
        where.AND.push({
          start_date: {
            gte: new Date(value), // Use gte (greater than or equal to)
          },
        });
      } else if (key === 'dateTo' && value) { // Add logic for dateTo
        // Ensure the `AND` condition exists
        where.AND = where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : [];
        where.AND.push({
          end_date: {
            lte: new Date(value), // Use lte (less than or equal to)
          },
        });
      }
        else if (key === 'organisation_id' && value) {
          // Allow filtering by organization for admins
          if (loggedInUser?.user_type === 'user_account') {
            where.organisation_id = Number(value);
          }
        }
        // Add more conditions for additional filter keys
      });
    }

    const projects = await this.projectsService.fetchProjects({
      skip: parsedSkip,
      take: parsedTake,
      where,
      // orderBy: parsedOrderBy,
      // cursor: { id: cursor },
    });

    return projects;
  }

  // Other Pro
  @Get('getProjectHelpers')
  @Public()
  async getProjectUtils() {
    return {
      categories: categoryOptions,
      endMethodOptions,
      regionStatesWithDistricts,
      organisations: await this.prismaService.organisations.findMany({
        select: {
          organisation_id: true,
          organisation_name: true,
        },
      }),
    };
  }

  @Get('fetchUpdates')
  async fetchUpdates(
    @Req() request,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    // @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('statusFilter') statusFilter?: string,
    // @Query('orderBy') orderBy?: string,
    @Query() filters?: Record<string, string>, // Capture all filters as an object

    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const { user: loggedInUser } = request;
    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    const where: Prisma.Project_updatesWhereInput = {};
    where.AND = {
      Projects: {
        entity_id: platformEntity,
        // If user is an organization member, filter by their organization
        ...(loggedInUser?.user_type === 'organisation_member' &&
          loggedInUser?.organisation_id && {
            organisation_id: loggedInUser.organisation_id,
          }),
      },
    };
    if (search) {
      where.OR = [
        {
          update_title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    // Add status filtering
    if (statusFilter) {
      if (statusFilter === 'approved') {
        where.approved = true;
      } else if (statusFilter === 'pending') {
        where.approved = false;
      }
    }

    // if (filters) {
    //   // Construct the 'where' object dynamically based on the received filters
    //   Object.entries(filters).forEach(([key, value]) => {
    //     if (key === 'region' && value) {
    //       where.voter = where.voter || {};
    //       where.voter.location = value;
    //     } else if (key === 'status' && value) {
    //       where.approved = value;
    //     }
    //     // Add more conditions for additional filter keys
    //   });
    // }

    // Add datetime filtering
    if (dateFrom || dateTo) {
      where.date_time_added = {};

      if (dateFrom) {
        where.date_time_added.gte = new Date(dateFrom);
      }

      if (dateTo) {
        // Add 23:59:59 to include the full end date
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.date_time_added.lte = endDate;
      }
    }

    const total = await this.prismaService.project_updates.count({
      where: {
        ...where,
      },
    });

    const fetchedUpdates = await this.prismaService.project_updates.findMany({
      where: {
        ...where,
      },
      select: {
        update_id: true,
        project_id: true,
        update_title: true,
        description: true,
        approved: true,
        picture_url: true,
        date_time_added: true,
      },
      // orderBy: { severity_in_number: 'asc', createdAt: 'asc' },

      orderBy: [
        // { severity_in_number: 'asc' },
        { date_time_added: 'desc' },
      ],

      skip: parsedSkip,
      take: parsedTake,
    });

    return {
      data: fetchedUpdates,
      rowsCount: total,
    };
  }

  @Put('approveProjectUpdate')
  async approveUpdate(
    @Body(new ZodValidationPipe(ApproveProjectUpdateSchema))
    approveProjectUpdateDto: ApproveProjectUpdateDto,
  ) {
    // Check if project exists
    const project = await this.prismaService.projects.findUnique({
      where: { project_id: approveProjectUpdateDto.project_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if update exists and belongs to the project
    const existingUpdate = await this.prismaService.project_updates.findUnique({
      where: {
        update_id: approveProjectUpdateDto.update_id,
        project_id: approveProjectUpdateDto.project_id,
      },
    });

    if (!existingUpdate) {
      throw new NotFoundException(
        'Update not found or does not belong to the project',
      );
    }

    // Update approval status
    const updatedUpdate = await this.prismaService.project_updates.update({
      where: {
        update_id: approveProjectUpdateDto.update_id,
        project_id: approveProjectUpdateDto.project_id,
      },
      data: {
        approved: approveProjectUpdateDto.approved,
      },
      select: {
        project_id: true,
        update_id: true,
      },
    });

    return {
      message: `Updated succesfully`,
      update: updatedUpdate,
    };
  }

  @Delete('updates/:updateId')
  async deleteUpdate(@Req() request, @Param('updateId') updateId: string) {
    const { user: loggedInUser } = request;

    // Check if update exists
    const existingUpdate = await this.prismaService.project_updates.findUnique({
      where: { update_id: Number(updateId) },
      include: {
        Projects: {
          select: {
            project_id: true,
            organisation_id: true,
            entity_id: true,
          },
        },
      },
    });

    if (!existingUpdate || !existingUpdate.Projects) {
      throw new NotFoundException('Update or associated project not found');
    }

    // Security check: organization members can only delete updates from their organization's projects
    if (
      loggedInUser?.user_type === 'organisation_member' &&
      loggedInUser?.organisation_id
    ) {
      if (
        existingUpdate.Projects.organisation_id !== loggedInUser.organisation_id
      ) {
        throw new HttpException(
          "You can only delete updates from your organization's projects",
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // Check if the project belongs to the platform entity
    if (existingUpdate.Projects.entity_id !== platformEntity) {
      throw new HttpException(
        'Update does not belong to this platform',
        HttpStatus.FORBIDDEN,
      );
    }

    // Delete the update
    const deletedUpdate = await this.prismaService.project_updates.delete({
      where: { update_id: Number(updateId) },
      select: {
        update_id: true,
        update_title: true,
        project_id: true,
      },
    });

    return {
      message: 'Update deleted successfully',
      deletedUpdate,
    };
  }

  @Get(':id')
  async getProjectById(@Param('id') projectID: string) {
    // return this.projectsService.getProject({ project_id: Number(projectID) });
    const singleProject = await this.prismaService.projects.findUnique({
      where: { project_id: Number(projectID) },
      // select: {
      //   project_id: true,
      //   date_time_added: true,
      //   title: true,
      //   subtitle: true,
      //   description: true,
      //   story: true,
      //   category: true,
      //   end_method: true,
      //   start_date: true,
      //   end_date: true,

      //   village: true,
      //   location_district: true,
      //   country_region: true,

      //   organisation_id: true,

      //   status: true,
      // },
      select: {
        project_id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        tags: true,
        video: true,
        start_date: true,
        end_date: true,
        recommended_amount: true,
        funding_goal: true,
        available_grant: true,
        end_method: true,
        community_name: true,
        country_region: true,
        location_district: true,
        village: true,
        implementation_start_date: true,
        implementation_end_date: true,
        organisation_id: true,
        added_by: true,
        date_time_added: true,
        entity_id: true,
        story: true,
        // picture_1, picture_2, picture_3 are excluded
        latitude: true,
        longitude: true,
        status: true,
        project_value: true,
        // Project_accounts: true,
        // Project_committee: true,
        // Project_reviews: true,
        // Project_updates: true,
      },
    });

    if (!singleProject)
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND);

    const projecImages = await this.prismaService.project_images.findUnique({
      where: { project_id: Number(projectID) },
      select: {
        url_1: true,
        url_2: true,
        url_3: true,
      },
    });
    singleProject['images'] = projecImages;

    const organisation = await this.prismaService.organisations.findUnique({
      where: { organisation_id: Number(singleProject.organisation_id) },
      select: {
        organisation_name: true,
      },
    });

    return {
      ...singleProject,
      images: projecImages,
      organisation,
    };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProjectSchema))
  async createProject(
    @Req() request,
    @Body() createProjectData: CreateProjectDto,
  ) {
    const { user: loggedInUser } = request;

    // For organization members, automatically set their organization_id
    if (
      loggedInUser?.user_type === 'organisation_member' &&
      loggedInUser?.organisation_id
    ) {
      createProjectData.organisation_id = loggedInUser.organisation_id;
    }

    // Checking category existence
    const categoryExistence =
      await this.prismaService.project_categories.findFirst({
        where: { category_name: createProjectData.category },
        // select: projectSelectedFields,
      });
    if (!categoryExistence)
      throw new HttpException('Category does not exist', HttpStatus.NOT_FOUND);

    // Checking organization existence
    const organizationExistence =
      await this.prismaService.organisations.findFirst({
        where: { organisation_id: createProjectData.organisation_id },
      });
    if (!organizationExistence)
      throw new HttpException(
        'Organization does not exist',
        HttpStatus.NOT_FOUND,
      );

    // Checking entity existence
    const entityExistence = await this.prismaService.entities.findFirst({
      where: { id: createProjectData.entity_id },
    });
    if (!entityExistence)
      throw new HttpException('Entity does not exist', HttpStatus.NOT_FOUND);

    const dataInput: Prisma.ProjectsCreateInput = {
      ...createProjectData,
      start_date: new Date(createProjectData.start_date),
      end_date: new Date(createProjectData.end_date),
      project_value:
        createProjectData.funding_goal + createProjectData.available_grant,
      added_by: 'admin',
      status: 'Pending',
      date_time_added: new Date(),
    };

    const createdData = await this.projectsService.createProject(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  @Put(':id')
  // @UsePipes(new ZodValidationPipe(UpdateProjectSchema))
  async updateProject(
    @Req() request,
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) // @Body()
    updateProjectData: UpdateProjectDto,
  ) {
    const { user: loggedInUser } = request;

    // For organization members, automatically set their organization_id
    if (
      loggedInUser?.user_type === 'organisation_member' &&
      loggedInUser?.organisation_id
    ) {
      updateProjectData.organisation_id = loggedInUser.organisation_id;
    }

    // Checking if the project exists
    const existingProject = await this.projectsService.getProject({
      project_id: Number(projectID),
    });

    // Security check: organization members can only update their own organization's projects
    if (
      loggedInUser?.user_type === 'organisation_member' &&
      loggedInUser?.organisation_id
    ) {
      if (existingProject.organisation_id !== loggedInUser.organisation_id) {
        throw new HttpException(
          'You can only update projects from your organization',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // Checking category existence
    if (updateProjectData.category) {
      const categoryExistence =
        await this.prismaService.project_categories.findFirst({
          where: { category_name: updateProjectData.category },
        });
      if (!categoryExistence)
        throw new HttpException(
          'Category does not exist',
          HttpStatus.NOT_FOUND,
        );
    }

    // Checking organization existence
    if (updateProjectData.organisation_id) {
      const organizationExistence =
        await this.prismaService.organisations.findFirst({
          where: { organisation_id: updateProjectData.organisation_id },
        });
      if (!organizationExistence)
        throw new HttpException(
          'Organization does not exist',
          HttpStatus.NOT_FOUND,
        );
    }

    // Checking entity existence
    if (updateProjectData.entity_id) {
      const entityExistence = await this.prismaService.entities.findFirst({
        where: { id: updateProjectData.entity_id },
      });
      if (!entityExistence)
        throw new HttpException('Entity does not exist', HttpStatus.NOT_FOUND);
    }

    const {
      start_date,
      end_date,
      funding_goal,
      available_grant,
      project_value,
    } = updateProjectData;

    const dataInput: Prisma.ProjectsUpdateInput = {
      ...updateProjectData,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : new Date(),
      project_value:
        funding_goal && available_grant
          ? funding_goal + available_grant
          : project_value,
    };

    const updatedData = await this.projectsService.updateProject({
      where: { project_id: Number(projectID) },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  @Delete(':id')
  async deleteProject(@Param('id') projectID: string) {
    // Checking if the project exists
    await this.projectsService.getProject({
      project_id: Number(projectID),
    });

    return this.projectsService.deleteProject({
      project_id: Number(projectID),
    });
  }

  //** Status */
  @Put(':id/update-status')
  async updateProjectStatus(
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(UpdateProjectStatusSchema))
    updateProjectStatusDto: UpdateProjectStatusDto,
  ) {
    // Checking if the project exists
    await this.projectsService.getProject({ project_id: Number(projectID) });

    const dataInput: Prisma.ProjectsUpdateInput = {
      ...updateProjectStatusDto,
    };

    const updatedData = await this.projectsService.updateProject({
      where: { project_id: Number(projectID) },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  //** Story */
  @Put(':id/update-story')
  // @UsePipes(new ZodValidationPipe(UpdateProjectSchema))
  async updateProjectStory(
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(UpdateProjectStorySchema)) // @Body()
    updateProjectData: UpdateProjectStoryDto,
  ) {
    // Checking if the project exists
    await this.projectsService.getProject({ project_id: Number(projectID) });

    const dataInput: Prisma.ProjectsUpdateInput = {
      ...updateProjectData,
    };

    const updatedData = await this.projectsService.updateProject({
      where: { project_id: Number(projectID) },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  //** Accounts */
  @Get(':id/accounts')
  async fetchProjectAccounts(
    @Param('id') projectID: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.Project_accountsWhereInput = {};
    // Default projectID
    where.AND = { project_Id: Number(projectID) };

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    if (search) {
      where.OR = [
        { bankId: { contains: search } },
        { AccNo: { contains: search } },
        // Add more conditions for searching in other fields
      ];
    }

    const projects = await this.projectsService.fetchAccounts({
      skip: parsedSkip,
      take: parsedTake,
      where,
    });

    return projects;
  }


  
//get function for the documents to read

@Get(':projectId/documents')
async getProjectDocuments(@Param('projectId') projectId: string) {
  const projectExists = await this.prismaService.projects.findUnique({
    where: { project_id: Number(projectId) },
  });

  if (!projectExists) {
    throw new NotFoundException(`Project with ID ${projectId} not found.`);
  }

  
  // This part relies on the Prisma table, which you are skipping.
  /*
  const documents = await this.prismaService.projectDocuments.findMany({
    where: { project_id: Number(projectId) },
    orderBy: { uploadDate: 'desc' },
  });
  return documents;
  */

  console.log(`[DEV MODE] Skipping Prisma: Frontend requested documents for project ${projectId}. Returning empty array.`);
  return []; 
}

  @Post(':id/accounts')
  async createProjectAccount(
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(CreateProjectAccountSchema))
    createProjectAccountDto: CreateProjectAccountDto,
  ) {
    // Checking organisation existance
    this.projectsService.getProject({ project_id: Number(projectID) });

    const dataInput: Prisma.Project_accountsCreateInput = {
      ...createProjectAccountDto,
      Projects: {
        connect: {
          project_id: Number(projectID),
        },
      },
      added_by: 'admin',
      date_time_added: new Date(),
    };

    const createdData = await this.projectsService.createAccount(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  // ** Committee *
  @Get(':id/committees')
  async fetchProjectCommittees(
    @Param('id') projectID: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.Project_committeeWhereInput = {};
    // Default projectID
    where.AND = { project_id: Number(projectID) };

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    if (search) {
      where.OR = [
        { committee_name: { contains: search } },
        { committee_mobile_number: { contains: search } },
        // Add more conditions for searching in other fields
      ];
    }

    const projects = await this.projectsService.fetchCommittee({
      skip: parsedSkip,
      take: parsedTake,
      where,
    });

    return projects;
  }

  @Post(':id/committees')
  async createProjectCommittee(
    @Param('id') projectID: string,
    @Body(new ZodValidationPipe(CreateProjectCommitteeSchema))
    createProjectCommitteeDto: CreateProjectCommitteeDto,
  ) {
    // Checking projects existance
    this.projectsService.getProject({ project_id: Number(projectID) });

    const dataInput: Prisma.Project_committeeCreateInput = {
      ...createProjectCommitteeDto,
      Projects: {
        connect: {
          project_id: Number(projectID),
        },
      },
      added_by: 'admin',
      date_time_added: new Date(),
    };

    const createdData = await this.projectsService.createCommittee(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  @Put(':id/committees/:committeeID')
  async updateOrganisation(
    @Param('id') projectID: string,
    @Param('committeeID') committeeID: string,
    @Body(new ZodValidationPipe(UpdateProjectCommitteeSchema))
    updateProjectCommitteeDto: UpdateProjectCommitteeDto,
  ) {
    // Checking project existance
    await this.projectsService.getProject({ project_id: Number(projectID) });

    // Checking Committee existance
    await this.projectsService.getCommittee({
      committee_id: Number(committeeID),
    });

    const dataInput: Prisma.Project_committeeUpdateInput = {
      ...updateProjectCommitteeDto,
    };

    const updatedData = await this.projectsService.updateCommittee({
      where: { committee_id: Number(committeeID) },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  @Post(':id/upload-files')
  @UseInterceptors(FileInterceptor('image')) // The field name will be ignored in the logic
  async uploadProjectFile(
    @Param('id') projectId: string,
    @Body(new ZodValidationPipe(ProjectImagesSchema))
    projectImagesDto: ProjectImagesDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    try {
      // Validate name field
      const validNames = ['image_1', 'image_2', 'image_3'];
      if (!validNames.includes(projectImagesDto.name)) {
        throw new Error(
          'Invalid name. Allowed values are image_1, image_2, or image_3',
        );
      }

      // Check if project exists
      const project = await this.prismaService.projects.findUnique({
        where: { project_id: Number(projectId) },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      let projectImages = await this.prismaService.project_images.findUnique({
        where: { project_id: Number(projectId) },
      });

      // Construct the image filename
      // const fileExtension = extname(image.originalname);
      // const newFileName = `${projectImagesDto.name}${fileExtension}`;
      const newFileName = projectImagesDto.name;

      // If an existing image URL exists, delete it first
      if (projectImages) {
        if (projectImagesDto.name === 'image_1' && projectImages.url_1) {
          await this.cloudinaryService.deleteImage(
            projectImages.url_1,
            projectId,
          );
        }
        if (projectImagesDto.name === 'image_2' && projectImages.url_2) {
          await this.cloudinaryService.deleteImage(
            projectImages.url_2,
            projectId,
          );
        }
        if (projectImagesDto.name === 'image_3' && projectImages.url_3) {
          await this.cloudinaryService.deleteImage(
            projectImages.url_3,
            projectId,
          );
        }
      }

      // Upload new image to Cloudinary with custom filename
      const uploadedImage = await this.cloudinaryService.uploadImage(
        image,
        newFileName,
        projectId,
      );
      const imageUrl = uploadedImage.secure_url;

      // If projectImage found --> Update
      if (projectImages) {
        await this.prismaService.project_images.update({
          where: { project_id: Number(projectId) },
          data: {
            image_name_1:
              projectImagesDto.name === 'image_1'
                ? projectImagesDto.name
                : projectImages.image_name_1,
            image_name_2:
              projectImagesDto.name === 'image_2'
                ? projectImagesDto.name
                : projectImages.image_name_2,
            image_name_3:
              projectImagesDto.name === 'image_3'
                ? projectImagesDto.name
                : projectImages.image_name_3,
            url_1:
              projectImagesDto.name === 'image_1'
                ? imageUrl
                : projectImages.url_1,
            url_2:
              projectImagesDto.name === 'image_2'
                ? imageUrl
                : projectImages.url_2,
            url_3:
              projectImagesDto.name === 'image_3'
                ? imageUrl
                : projectImages.url_3,
          },
        });
        return 'Project image updated successfully';
      }

      // If NOT -- Create
      else {
        projectImages = await this.prismaService.project_images.create({
          data: {
            project_id: Number(projectId),
            image_name_1:
              projectImagesDto.name === 'image_1'
                ? projectImagesDto.name
                : null,
            image_name_2:
              projectImagesDto.name === 'image_2'
                ? projectImagesDto.name
                : null,
            image_name_3:
              projectImagesDto.name === 'image_3'
                ? projectImagesDto.name
                : null,
            url_1: projectImagesDto.name === 'image_1' ? imageUrl : null,
            url_2: projectImagesDto.name === 'image_2' ? imageUrl : null,
            url_3: projectImagesDto.name === 'image_3' ? imageUrl : null,
          },
        });

        return 'Project image created successfully';
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }
//creating documents and taking from clients

@Post(':projectId/documents')
@UseInterceptors(FileInterceptor('file')) // 'file' must match the formData key from frontend
async uploadProjectDocument(
  @Param('projectId') projectId: string,
  @UploadedFile() file: Express.Multer.File, // Type for the uploaded file
  @Body(new ZodValidationPipe(CreateProjectDocumentSchema)) // Validate optional metadata
  createProjectDocumentDto: CreateProjectDocumentDto,
) {
  if (!file) {
    throw new BadRequestException('No file uploaded.');
  }

 
  const projectExists = await this.prismaService.projects.findUnique({
    where: { project_id: Number(projectId) },
  });

  if (!projectExists) {
    throw new NotFoundException(`Project with ID ${projectId} not found.`);
  }

  try {
    // 1. Upload to Cloudinary (This part remains active and is the core of your test)
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file.buffer, {
      resource_type: 'raw', // Important: Use 'raw' for non-image documents (PDFs, docs, etc.)
      folder: `project_documents/${projectId}`, // Optional: Organize files in Cloudinary by project ID
      public_id: file.originalname.split('.')[0] || `document-${Date.now()}` // Use original name or a unique ID
    });

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new HttpException(
        'Failed to upload document to Cloudinary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }


    /*
    const savedDocument = await this.prismaService.projectDocuments.create({
      data: {
        project_id: Number(projectId),
        fileName: createProjectDocumentDto.fileName || file.originalname,
        fileType: file.mimetype,
        url: cloudinaryResponse.secure_url,
        description: createProjectDocumentDto.description,
        // uploadedBy: request.user.user_id, // If you have user authentication context
      },
    });
    */

    // Return a response that indicates success and includes the Cloudinary URL
    return {
      message: 'Document uploaded to Cloudinary (not saved to database)',
      // You can return a simulated document object for frontend testing
      document: {
        document_id: Date.now(), // Use a unique ID for temporary frontend display
        project_id: Number(projectId),
        fileName: createProjectDocumentDto.fileName || file.originalname,
        fileType: file.mimetype,
        url: cloudinaryResponse.secure_url,
        description: createProjectDocumentDto.description,
        uploadDate: new Date().toISOString(),
      },
    };

  } catch (error) {
    console.error('Error uploading document:', error);
    throw new HttpException(
      'Error processing document upload',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause: error.message },
    );
  }
}
  // ** Inkind donations *
  @Get(':id/transactions')
  async fetchProjectTransactions(
    @Param('id') projectID: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    // Get all projects Accounts
    const currentProject = await this.prismaService.projects.findFirst({
      where: { project_id: Number(projectID) },
      select: {
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

    const where: Prisma.ReceiptsWhereInput = {};

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    if (search) {
      where.OR = [
        { AccNo: { contains: search } },
        { CustomerName: { contains: search } },
        { Narration: { contains: search } },
        { DrCr: { contains: search } },
        { Category: { contains: search } },
      ];
    }

    where.AND = {
      AccNo: {
        in: projectsAccountsArray,
      },
      CurrencyCode: 'USD',
      id: {
        // notIn: [15655, 15654, 15653], // Don't showing transactions that are matching fund
      },
    };

    // Getting transactions with targetted project accounts
    const projectTransactions = await this.prismaService.receipts.findMany({
      where,
      select: {
        id: true,
        AccNo: true,
        TranAmt: true,
        Narration: true,
        CustomerName: true,
        Category: true,
        DrCr: true,
        TranDate: true,
      },
      skip: parsedSkip,
      take: parsedTake,
      // orderBy: {
      //   TranDate: 'asc',
      // },
    });
    const rowsCount: number = await this.prismaService.receipts.count({
      where,
    });

    return {
      data: projectTransactions,
      rowsCount,
    };
  }

  //added this post
  // Add this to ProjectsController

// GET stays the same (still reads from Receipts)

// Add manual transaction into Receipts
@Post(':id/transactions')
async addTransaction(
  @Param('id') projectId: string,
  @Body()
  transactionData: {
    AccNo: string
    TranAmt: number
    CustomerName?: string
    Narration?: string
    Category?: string
    DrCr?: string
    CurrencyCode?: string
    TranDate?: string   // ✅ added
  },
) {
  // ✅ Verify project exists
  const project = await this.prismaService.projects.findUnique({
    where: { project_id: Number(projectId) },
    include: { Project_accounts: true },
  })
  if (!project) {
    throw new NotFoundException(`Project ${projectId} not found`)
  }

  // ✅ Ensure account belongs to project
  const accounts = project.Project_accounts.map((acc) => acc.AccNo)
  if (!accounts.includes(transactionData.AccNo)) {
    throw new BadRequestException(
      `Account ${transactionData.AccNo} does not belong to project ${projectId}`,
    )
  }

  // ✅ Insert into Receipts (same table used for GET)
  const safeTranAmt = transactionData.TranAmt !== null && !isNaN(Number(transactionData.TranAmt))
    ? Number(transactionData.TranAmt)
    : 0;

  const transaction = await this.prismaService.receipts.create({
   
     data: {
    TranNo: crypto.randomUUID(),
    AccNo: transactionData.AccNo,
    // TranAmt: new Prisma.Decimal(transactionData.TranAmt), // ✅ important
    TranAmt: new Prisma.Decimal(safeTranAmt),
    CustomerName: transactionData.CustomerName,
    Narration: transactionData.Narration,
    Category: transactionData.Category,
    DrCr: transactionData.DrCr,
    CurrencyCode: (transactionData.CurrencyCode || 'USD').trim().toUpperCase(),
    TranDate: transactionData.TranDate 
      ? new Date(transactionData.TranDate).toISOString()
      : new Date().toISOString(),
  }


  })

  return {
    statusCode: 201,
    message: 'Transaction added successfully',
    data: transaction,
  }
}


  // ** Transactinos *
  @Get(':id/in-kind-donations')
  @Public()
  async fetchInKindDonations(
    @Param('id') projectID: string,
    //  @Query('skip') skip?: string,
    //  @Query('take') take?: string,
    //  @Query('search') search?: string,
    @Query(new ZodValidationPipe(searchFilterSchema)) params: SearchFilterDto,
  ) {
    try {
      const {
        skip,
        take,
        project_id,
        inkind_type,
        donated_by,
        mobile_number,
        search,
        minAmount,
        maxAmount,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      } = params;

      const parsedSkip = (skip - 1) * take;
      const parsedTake = Number(take) || 5;

      // Build where conditions for filtering
      const whereConditions: Prisma.In_kind_donationsWhereInput = {};
      whereConditions.project_id = Number(projectID);

      // Apply specific filters
      if (project_id) {
        whereConditions.project_id = project_id;
      }

      if (inkind_type) {
        whereConditions.inkind_type = inkind_type;
      }

      if (donated_by) {
        whereConditions.donated_by = {
          contains: donated_by,
          // mode: 'insensitive', // Case-insensitive search
        };
      }

      if (mobile_number) {
        whereConditions.mobile_number = {
          contains: mobile_number,
          // mode: 'insensitive',
        };
      }

      // Handle amount range
      if (minAmount !== undefined || maxAmount !== undefined) {
        whereConditions.total_amount = {};

        if (minAmount !== undefined) {
          whereConditions.total_amount.gte = minAmount;
        }

        if (maxAmount !== undefined) {
          whereConditions.total_amount.lte = maxAmount;
        }
      }

      // Handle date range
      if (startDate || endDate) {
        whereConditions.added_on = {};

        if (startDate) {
          whereConditions.added_on.gte = startDate;
        }

        if (endDate) {
          // Set to end of day for the end date
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          whereConditions.added_on.lte = endOfDay;
        }
      }

      // Handle search across multiple fields
      if (search) {
        whereConditions.OR = [
          {
            donated_by: {
              contains: search,
              // mode: 'insensitive',
            },
          },
          {
            mobile_number: {
              contains: search,
              // mode: 'insensitive',
            },
          },
          {
            added_by: {
              contains: search,
              // mode: 'insensitive',
            },
          },
        ];
      }

      // Build sort order
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Get donations with pagination, filtering, and sorting
      const donations = await this.prismaService.in_kind_donations.findMany({
        where: whereConditions,
        skip: parsedSkip,
        take: parsedTake,
        orderBy,
        // include: {

        // If you have relationships defined in your Prisma schema, you can include them here
        // For example:
        // donation_type: true,
        // project: true
        // },
      });

      // Get total count for pagination
      const total = await this.prismaService.in_kind_donations.count({
        where: whereConditions,
      });

      // Get donation types information
      const donationTypeIds = [...new Set(donations.map((d) => d.inkind_type))];
      const donationTypes =
        await this.prismaService.in_kind_donation_types.findMany({
          where: { Id: { in: donationTypeIds } },
        });

      // Enhance donations with type information
      const enhancedDonations = donations.map((donation) => {
        const typeInfo = donationTypes.find(
          (t) => t.Id === donation.inkind_type,
        );
        return {
          ...donation,
          type_details: typeInfo || null,
        };
      });

      return {
        data: enhancedDonations,
        rowsCount: total,
      };

      // return {
      //   success: true,
      //   data: enhancedDonations,
      //   meta: {
      //     total,
      //     skip,
      //     take,
      //     totalPages: Math.ceil(total / take),
      //     filters: {
      //       project_id,
      //       inkind_type,
      //       donated_by,
      //       mobile_number,
      //       search,
      //       minAmount,
      //       maxAmount,
      //       startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      //       endDate: endDate ? endDate.toISOString().split('T')[0] : null,
      //     },
      //   },
      // };
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve in-kind donations: ' + error.message,
      );
    }
  }
}
