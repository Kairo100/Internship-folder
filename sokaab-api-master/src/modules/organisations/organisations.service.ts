import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Organisations, Organisation_members, Prisma } from '@prisma/client';

import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class OrganisationsService {
  constructor(private prisma: PrismaService) {}

  //** Organisations */
  async fetchOrganisations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganisationsWhereUniqueInput;
    where?: Prisma.OrganisationsWhereInput;
    orderBy?: Prisma.OrganisationsOrderByWithRelationInput;
  }): Promise<{ data: Organisations[]; rowsCount: number }> {
    const {
      skip,
      take,
      // cursor,
      where,
      // orderBy,
    } = params;

    const data: Organisations[] = await this.prisma.organisations.findMany({
      skip,
      take,
      // cursor,
      where,
      orderBy: {
        date_time_added: 'desc',
      },
    });

    const rowsCount: number = await this.prisma.organisations.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getOrganisation(
    organisationWhereUniqueInput: Prisma.OrganisationsWhereUniqueInput,
  ): Promise<Organisations> {
    const singleOrganisation: Organisations | null =
      await this.prisma.organisations.findUnique({
        where: organisationWhereUniqueInput,
      });

    if (!singleOrganisation)
      throw new HttpException('Organisation not found.', HttpStatus.NOT_FOUND);

    return singleOrganisation;
  }

  async createOrganisation(
    data: Prisma.OrganisationsCreateInput,
  ): Promise<Organisations> {
    const createdData = await this.prisma.organisations.create({
      data,
    });

    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateOrganisation(params: {
    where: Prisma.OrganisationsWhereUniqueInput;
    data: Prisma.OrganisationsUpdateInput;
  }): Promise<Organisations> {
    const { where, data } = params;
    return this.prisma.organisations.update({
      data,
      where,
    });
  }

  async deleteOrganisation(
    where: Prisma.OrganisationsWhereUniqueInput,
  ): Promise<Organisations> {
    return this.prisma.organisations.delete({
      where,
    });
  }

  //** Organisation Members*/
  async fetchOrganisationMembers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganisationsWhereUniqueInput;
    where?: Prisma.Organisation_membersWhereInput;
    orderBy?: Prisma.OrganisationsOrderByWithRelationInput;
  }): Promise<{ data: Organisation_members[]; rowsCount: number }> {
    const {
      skip,
      take,
      // cursor,
      where,
      // orderBy,
    } = params;

    const data: Organisation_members[] =
      await this.prisma.organisation_members.findMany({
        skip,
        take,
        // cursor,
        where,
        orderBy: {
          date_time_added: 'desc',
        },
      });

    const rowsCount: number = await this.prisma.organisation_members.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async getOrganisationMember(
    organisationWhereUniqueInput: Prisma.Organisation_membersWhereUniqueInput,
  ): Promise<Organisation_members> {
    const singleOrganisation: Organisation_members | null =
      await this.prisma.organisation_members.findUnique({
        where: organisationWhereUniqueInput,
      });

    if (!singleOrganisation)
      throw new HttpException('Member not found.', HttpStatus.NOT_FOUND);

    return singleOrganisation;
  }

  async createOrganisationMember(
    data: Prisma.OrganisationsCreateInput,
  ): Promise<Organisation_members> {
    const createdData = await this.prisma.organisation_members.create({
      data,
    });

    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }

  async updateOrganisationMember(params: {
    where: Prisma.Organisation_membersWhereUniqueInput;
    data: Prisma.OrganisationsUpdateInput;
  }): Promise<Organisation_members> {
    const { where, data } = params;
    return this.prisma.organisation_members.update({
      data,
      where,
    });
  }

  async deleteOrganisationMember(
    where: Prisma.Organisation_membersWhereUniqueInput,
  ): Promise<Organisation_members> {
    return this.prisma.organisation_members.delete({
      where,
    });
  }
}
