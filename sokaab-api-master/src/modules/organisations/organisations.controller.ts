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
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { OrganisationsService } from './organisations.service';
import {
  CreateOrganisationSchema,
  CreateOrganisationDto,
  UpdateOrganisationSchema,
  UpdateOrganisationDto,
  CreateOrganisationMemberDto,
  CreateOrganisationMemberSchema,
  // UpdateOrganisationMemberSchema,
  // UpdateOrganisationMemberDto,
} from './dto/dtos';
import { ZodValidationPipe } from 'src/validations/zod';
import { PrismaService } from 'src/services/prisma.service';

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
    // @Query() filters?: Record<string, string>, // Capture all filters as an object
  ) {
    const where: Prisma.OrganisationsWhereInput = {};

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

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

    const organisations = await this.organisationsService.fetchOrganisations({
      skip: parsedSkip,
      take: parsedTake,
      where,
    });

    return organisations;
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

  //** Organisation Members */
  @Get(':id/members')
  async fetchOrganisationMembers(
    @Param('id') organisationID: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
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

    const dataInput: Prisma.Organisation_membersCreateInput = {
      ...createOrganisationMemberDto,
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

  // @Put(':id')
  // async updateOrganisation(
  //   @Param('id') organisationID: string,
  //   @Body(new ZodValidationPipe(UpdateOrganisationSchema))
  //   updateOrganisationData: UpdateOrganisationDto,
  // ) {
  //   // Checking if the organisation exists
  //   const currentOrganisation = await this.organisationsService.getOrganisation(
  //     { organisation_id: Number(organisationID) },
  //   );

  //   // Checking email uniqueness
  //   if (
  //     currentOrganisation.email_address !== updateOrganisationData.email_address
  //   ) {
  //     const emailExistance = await this.prismaService.organisations.findFirst({
  //       where: { email_address: updateOrganisationData.email_address },
  //     });
  //     if (emailExistance)
  //       throw new HttpException(
  //         'This email address is already taken',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //   }

  //   const dataInput: Prisma.OrganisationsUpdateInput = {
  //     ...updateOrganisationData,
  //   };

  //   const updatedData = await this.prismaService.organisations.update({
  //     where: { organisation_id: Number(organisationID) },
  //     data: dataInput,
  //   });

  //   return {
  //     statusCode: 200,
  //     message: 'Data successfully updated',
  //     data: updatedData,
  //   };
  // }

  // @Delete(':id')
  // async deleteOrganisation(@Param('id') organisationID: string) {
  //   // Checking if the organisation exists
  //   await this.organisationsService.getOrganisation({
  //     organisation_id: Number(organisationID),
  //   });

  //   const deletedOrganisation = this.organisationsService.deleteOrganisation({
  //     organisation_id: Number(organisationID),
  //   });

  //   return {
  //     statusCode: 200,
  //     message: 'Data successfully deleted',
  //     data: deletedOrganisation,
  //   };
  // }
}
