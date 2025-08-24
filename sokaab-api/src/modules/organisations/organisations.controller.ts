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
  Req,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

import { OrganisationsService } from './organisations.service';
import {
  CreateOrganisationSchema,
  CreateOrganisationDto,
  UpdateOrganisationSchema,
  UpdateOrganisationDto,
  CreateOrganisationMemberDto,
  CreateOrganisationMemberSchema,
  UpdateOrganisationMemberSchema,
  UpdateOrganisationMemberDto,
} from './dto/dtos';
import { ZodValidationPipe } from 'src/validations/zod';
import { PrismaService } from 'src/services/prisma.service';
import { platformEntity } from 'src/constants';

@Controller('organisations')
export class OrganisationsController {
  constructor(
    private readonly organisationsService: OrganisationsService,
    private readonly prismaService: PrismaService,
  ) {}

  //** Organisations */
  @Get()
  async fetch(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('includeCounts') includeCounts?: string,
    // @Query() filters?: Record<string, string>, // Capture all filters as an object
  ) {
    const where: Prisma.OrganisationsWhereInput = {};
    where.entity_id = platformEntity;

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;
    const includeCountsBool = includeCounts === 'true';

    if (search) {
      where.OR = [
        { organisation_id: { equals: Number(search) } },
        { organisation_name: { contains: search } },
        { organisation_bio: { contains: search } },
        { email_address: { contains: search } },
        { address: { contains: search } },
        { country: { contains: search } },
        { account_status: { contains: search } },
        // Add more conditions for searching in other fields
      ];
    }

    if (includeCountsBool) {
      // Manual count fetching for enhanced data
      const organisations = await this.organisationsService.fetchOrganisations({
        skip: parsedSkip,
        take: parsedTake,
        where,
      });

      // Enhance each organization with counts
      const enhancedOrganisations = await Promise.all(
        organisations.data.map(async (org) => {
          const memberCount =
            await this.prismaService.organisation_members.count({
              where: { organisation_id: org.organisation_id },
            });

          let projectCount = 0;
          try {
            projectCount = await this.prismaService.projects.count({
              where: { organisation_id: org.organisation_id },
            });
          } catch (error) {
            // If projects table doesn't exist, default to 0
            projectCount = 0;
          }

          return {
            ...org,
            _count: {
              members: memberCount,
              projects: projectCount,
            },
          };
        }),
      );

      return {
        data: enhancedOrganisations,
        rowsCount: organisations.rowsCount,
      };
    } else {
      const organisations = await this.organisationsService.fetchOrganisations({
        skip: parsedSkip,
        take: parsedTake,
        where,
      });

      return organisations;
    }
  }

  // Statistics endpoint - MUST be before parameterized routes
  @Get('statistics')
  async getOrganizationStatistics() {
    const totalOrganizations = await this.prismaService.organisations.count();
    const activeOrganizations = await this.prismaService.organisations.count({
      where: { account_status: 'Active' },
    });

    const totalMembers = await this.prismaService.organisation_members.count();

    // Get project count if projects table exists
    let totalProjects = 0;
    try {
      totalProjects = await this.prismaService.projects.count({
        where: {
          entity_id: platformEntity,
        },
      });
    } catch (error) {
      // If projects table doesn't exist, default to 0
      totalProjects = 0;
    }

    return {
      totalOrganizations,
      activeOrganizations,
      totalMembers,
      totalProjects,
    };
  }

  @Get(':id')
  async getOrganisationById(@Param('id') organisationID: string) {
    return this.organisationsService.getOrganisation({
      organisation_id: Number(organisationID),
    });
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateOrganisationSchema))
  async createOrganisation(
    @Body() createOrganisationData: CreateOrganisationDto,
  ) {
    // Checking email uniqueness
    const emailExistance = await this.prismaService.organisations.findFirst({
      where: { email_address: createOrganisationData.email_address },
    });
    if (emailExistance)
      throw new HttpException(
        'Email address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Checking phone uniqueness
    const phonExistance = await this.prismaService.organisations.findFirst({
      where: {
        phone_number: createOrganisationData.phone_number,
      },
    });
    if (phonExistance)
      throw new HttpException(
        'Phone number address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Checking entity existence
    const entityExistence = await this.prismaService.entities.findFirst({
      where: { id: createOrganisationData.entity_id },
    });
    if (!entityExistence)
      throw new HttpException('Entity does not exist', HttpStatus.NOT_FOUND);

    const dataInput: Prisma.OrganisationsCreateInput = {
      ...createOrganisationData,
      added_by: 'admin',
      account_status: 'Active',
      date_time_added: new Date(),
    };

    const createdData =
      await this.organisationsService.createOrganisation(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  @Put(':id')
  async updateOrganisation(
    @Param('id') organisationID: string,
    @Body(new ZodValidationPipe(UpdateOrganisationSchema))
    updateOrganisationData: UpdateOrganisationDto,
  ) {
    // Checking if the organisation exists
    const currentOrganisation = await this.organisationsService.getOrganisation(
      { organisation_id: Number(organisationID) },
    );

    // Checking email uniqueness
    if (
      currentOrganisation.email_address !== updateOrganisationData.email_address
    ) {
      const emailExistance = await this.prismaService.organisations.findFirst({
        where: { email_address: updateOrganisationData.email_address },
      });
      if (emailExistance)
        throw new HttpException(
          'This email address is already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const dataInput: Prisma.OrganisationsUpdateInput = {
      ...updateOrganisationData,
    };

    const updatedData = await this.prismaService.organisations.update({
      where: { organisation_id: Number(organisationID) },
      data: dataInput,
    });

    return {
      statusCode: 200,
      message: 'Data successfully updated',
      data: updatedData,
    };
  }

  @Delete(':id')
  async deleteOrganisation(@Param('id') organisationID: string) {
    // Checking if the organisation exists
    await this.organisationsService.getOrganisation({
      organisation_id: Number(organisationID),
    });

    const deletedOrganisation = this.organisationsService.deleteOrganisation({
      organisation_id: Number(organisationID),
    });

    return {
      statusCode: 200,
      message: 'Data successfully deleted',
      data: deletedOrganisation,
    };
  }

  // Endpoint for organization members to access their own organization's data
  @Get('my-organization')
  async getMyOrganization(@Req() request) {
    const { user: loggedInUser } = request;
    console.log('^^^^^^11');

    if (
      loggedInUser?.user_type !== 'organisation_member' ||
      !loggedInUser?.organisation_id
    ) {
      throw new HttpException(
        'Access denied. Only organization members can access this endpoint.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.organisationsService.getOrganisation({
      organisation_id: loggedInUser.organisation_id,
    });
  }

  @Get('my-organization/members')
  async getMyOrganizationMembers(@Req() request) {
    console.log('^^^^^^');

    const { user: loggedInUser } = request;
    console.log('--', loggedInUser);

    if (
      loggedInUser?.user_type !== 'organisation_member' ||
      !loggedInUser?.organisation_id
    ) {
      throw new HttpException(
        'Access denied. Only organization members can access this endpoint.',
        HttpStatus.FORBIDDEN,
      );
    }

    const members = await this.organisationsService.fetchOrganisationMembers({
      skip: 0,
      take: 100, // Get all members for organization
      where: {
        organisation_id: loggedInUser.organisation_id,
      },
    });

    return members;
  }

  // Organization member endpoints for managing their own team
  @Post('my-organization/members')
  async createMyOrganizationMember(
    @Req() request,
    @Body(new ZodValidationPipe(CreateOrganisationMemberSchema))
    createOrganisationMemberDto: CreateOrganisationMemberDto,
  ) {
    const { user: loggedInUser } = request;

    if (
      loggedInUser?.user_type !== 'organisation_member' ||
      !loggedInUser?.organisation_id
    ) {
      throw new HttpException(
        'Access denied. Only organization members can access this endpoint.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Checking email uniqueness
    const emailExistance =
      await this.prismaService.organisation_members.findFirst({
        where: { email_address: createOrganisationMemberDto.email_address },
      });
    if (emailExistance)
      throw new HttpException(
        'Email address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Checking phone uniqueness
    const phoneExistance =
      await this.prismaService.organisation_members.findFirst({
        where: {
          telephone_number: createOrganisationMemberDto.telephone_number,
        },
      });
    if (phoneExistance)
      throw new HttpException(
        'Phone number already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Hash the password before saving
    const hashedPassword = await hash(createOrganisationMemberDto.password, 12);

    const dataInput: Prisma.Organisation_membersCreateInput = {
      ...createOrganisationMemberDto,
      password: hashedPassword,
      organisation_id: loggedInUser.organisation_id,
      email_verification_string: 'No',
      email_verified: false,
      added_by: loggedInUser.full_name || 'organization_member',
      date_time_added: new Date(),
    };

    const createdData =
      await this.organisationsService.createOrganisationMember(dataInput);

    return {
      statusCode: 200,
      message: 'Team member successfully added',
      data: createdData,
    };
  }

  @Put('my-organization/members/:memberID')
  async updateMyOrganizationMember(
    @Req() request,
    @Param('memberID') memberID: string,
    @Body(new ZodValidationPipe(UpdateOrganisationMemberSchema))
    updateOrganisationMemberDto: UpdateOrganisationMemberDto,
  ) {
    const { user: loggedInUser } = request;

    if (
      loggedInUser?.user_type !== 'organisation_member' ||
      !loggedInUser?.organisation_id
    ) {
      throw new HttpException(
        'Access denied. Only organization members can access this endpoint.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Checking if the member exists and belongs to the same organisation
    const currentMember = await this.organisationsService.getOrganisationMember(
      {
        member_id: Number(memberID),
        organisation_id: loggedInUser.organisation_id,
      },
    );

    // Checking email uniqueness (if email is being changed)
    if (
      updateOrganisationMemberDto.email_address &&
      currentMember.email_address !== updateOrganisationMemberDto.email_address
    ) {
      const emailExistance =
        await this.prismaService.organisation_members.findFirst({
          where: { email_address: updateOrganisationMemberDto.email_address },
        });
      if (emailExistance)
        throw new HttpException(
          'Email address already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    // Checking phone uniqueness (if phone is being changed)
    if (
      updateOrganisationMemberDto.telephone_number &&
      currentMember.telephone_number !==
        updateOrganisationMemberDto.telephone_number
    ) {
      const phoneExistance =
        await this.prismaService.organisation_members.findFirst({
          where: {
            telephone_number: updateOrganisationMemberDto.telephone_number,
          },
        });
      if (phoneExistance)
        throw new HttpException(
          'Phone number already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const dataInput: any = { ...updateOrganisationMemberDto };

    // Hash password if it's being updated
    if (updateOrganisationMemberDto.password) {
      const hashedPassword = await hash(
        updateOrganisationMemberDto.password,
        12,
      );
      dataInput.password = hashedPassword;
    }

    const updatedData =
      await this.organisationsService.updateOrganisationMember({
        where: {
          member_id: Number(memberID),
          organisation_id: loggedInUser.organisation_id,
        },
        data: dataInput,
      });

    return {
      statusCode: 200,
      message: 'Team member successfully updated',
      data: updatedData,
    };
  }

  @Delete('my-organization/members/:memberID')
  async deleteMyOrganizationMember(
    @Req() request,
    @Param('memberID') memberID: string,
  ) {
    const { user: loggedInUser } = request;

    if (
      loggedInUser?.user_type !== 'organisation_member' ||
      !loggedInUser?.organisation_id
    ) {
      throw new HttpException(
        'Access denied. Only organization members can access this endpoint.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Prevent self-deletion
    if (Number(memberID) === loggedInUser.member_id) {
      throw new HttpException(
        'You cannot delete your own account',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking if the member exists and belongs to the same organisation
    await this.organisationsService.getOrganisationMember({
      member_id: Number(memberID),
      organisation_id: loggedInUser.organisation_id,
    });

    const deletedMember =
      await this.organisationsService.deleteOrganisationMember({
        member_id: Number(memberID),
        organisation_id: loggedInUser.organisation_id,
      });

    return {
      statusCode: 200,
      message: 'Team member successfully removed',
      data: deletedMember,
    };
  }

  //** Organisation Members */
  @Get(':id/members')
  async fetchOrganisationMembers(
    @Param('id') organisationID: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    console.log('^^^^^^33');
    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    const where: Prisma.Organisation_membersWhereInput = {};

    // Default organisationID
    where.AND = { organisation_id: Number(organisationID) };

    if (search) {
      where.OR = [
        { organisation_id: { equals: Number(search) } },
        { full_name: { contains: search } },
        { telephone_number: { contains: search } },
        { email_address: { contains: search } },
        { position_held: { contains: search } },
      ];
    }

    const organisations =
      await this.organisationsService.fetchOrganisationMembers({
        skip: parsedSkip,
        take: parsedTake,
        where,
      });

    return organisations;
  }

  @Get(':id/members/:memberID')
  async getOrganisationMembersById(
    @Param('id') organisationID: string,
    @Param('memberID') memberID: string,
  ) {
    return this.organisationsService.getOrganisationMember({
      organisation_id: Number(organisationID), // Default organisationID
      member_id: Number(memberID),
    });
  }

  @Post(':id/members')
  async createOrganisationMember(
    @Param('id') organisationID: string,
    @Body(new ZodValidationPipe(CreateOrganisationMemberSchema))
    createOrganisationMemberDto: CreateOrganisationMemberDto,
  ) {
    // Checking organisation existance
    const organisationExistence =
      await this.prismaService.organisations.findFirst({
        where: { organisation_id: Number(organisationID) },
      });
    if (!organisationExistence)
      throw new HttpException(
        'Organisation does not exist',
        HttpStatus.NOT_FOUND,
      );

    // Checking email uniqueness
    const emailExistance =
      await this.prismaService.organisation_members.findFirst({
        where: { email_address: createOrganisationMemberDto.email_address },
      });
    if (emailExistance)
      throw new HttpException(
        'Email address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Checking phone uniqueness
    const phonExistance =
      await this.prismaService.organisation_members.findFirst({
        where: {
          telephone_number: createOrganisationMemberDto.telephone_number,
        },
      });
    if (phonExistance)
      throw new HttpException(
        'Phone number address already taken',
        HttpStatus.BAD_REQUEST,
      );

    // Hash the password before saving
    const hashedPassword = await hash(createOrganisationMemberDto.password, 12);

    const dataInput: Prisma.Organisation_membersCreateInput = {
      ...createOrganisationMemberDto,
      password: hashedPassword,
      organisation_id: Number(organisationID),
      email_verification_string: 'No',
      email_verified: false,
      added_by: 'admin',
      date_time_added: new Date(),
    };

    const createdData =
      await this.organisationsService.createOrganisationMember(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }

  @Put(':id/members/:memberID')
  async updateOrganisationMember(
    @Param('id') organisationID: string,
    @Param('memberID') memberID: string,
    @Body(new ZodValidationPipe(UpdateOrganisationMemberSchema))
    updateOrganisationMemberDto: UpdateOrganisationMemberDto,
  ) {
    // Checking if the member exists and belongs to the organisation
    const currentMember = await this.organisationsService.getOrganisationMember(
      {
        member_id: Number(memberID),
        organisation_id: Number(organisationID),
      },
    );

    // Checking email uniqueness (if email is being changed)
    if (
      updateOrganisationMemberDto.email_address &&
      currentMember.email_address !== updateOrganisationMemberDto.email_address
    ) {
      const emailExistance =
        await this.prismaService.organisation_members.findFirst({
          where: { email_address: updateOrganisationMemberDto.email_address },
        });
      if (emailExistance)
        throw new HttpException(
          'Email address already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    // Checking phone uniqueness (if phone is being changed)
    if (
      updateOrganisationMemberDto.telephone_number &&
      currentMember.telephone_number !==
        updateOrganisationMemberDto.telephone_number
    ) {
      const phoneExistance =
        await this.prismaService.organisation_members.findFirst({
          where: {
            telephone_number: updateOrganisationMemberDto.telephone_number,
          },
        });
      if (phoneExistance)
        throw new HttpException(
          'Phone number already taken',
          HttpStatus.BAD_REQUEST,
        );
    }

    const dataInput: any = { ...updateOrganisationMemberDto };

    // Hash password if it's being updated
    if (updateOrganisationMemberDto.password) {
      const hashedPassword = await hash(
        updateOrganisationMemberDto.password,
        12,
      );
      dataInput.password = hashedPassword;
    }

    const updatedData =
      await this.organisationsService.updateOrganisationMember({
        where: {
          member_id: Number(memberID),
          organisation_id: Number(organisationID),
        },
        data: dataInput,
      });

    return {
      statusCode: 200,
      message: 'Member successfully updated',
      data: updatedData,
    };
  }

  @Delete(':id/members/:memberID')
  async deleteOrganisationMember(
    @Param('id') organisationID: string,
    @Param('memberID') memberID: string,
  ) {
    // Checking if the member exists and belongs to the organisation
    await this.organisationsService.getOrganisationMember({
      member_id: Number(memberID),
      organisation_id: Number(organisationID),
    });

    const deletedMember =
      await this.organisationsService.deleteOrganisationMember({
        member_id: Number(memberID),
        organisation_id: Number(organisationID),
      });

    return {
      statusCode: 200,
      message: 'Member successfully deleted',
      data: deletedMember,
    };
  }
}
