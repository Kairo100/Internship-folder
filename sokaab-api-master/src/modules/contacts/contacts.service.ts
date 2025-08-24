import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contact_data, Prisma } from '@prisma/client';

import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  //** Contacts */
  async fetchContacts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.Contact_dataWhereUniqueInput;
    where?: Prisma.Contact_dataWhereInput;
    orderBy?: Prisma.Contact_dataOrderByWithRelationInput;
  }): Promise<{ data: Contact_data[]; rowsCount: number }> {
    const { skip, take, where } = params;

    const data: Contact_data[] = await this.prisma.contact_data.findMany({
      skip,
      take,
      where,
      orderBy: {
        added_on: 'desc',
      },
    });

    const rowsCount: number = await this.prisma.contact_data.count({
      where,
    });

    return {
      data,
      rowsCount,
    };
  }

  async createContact(
    data: Prisma.Contact_dataCreateInput,
  ): Promise<Contact_data> {
    const createdData = await this.prisma.contact_data.create({
      data,
    });

    if (!createdData)
      throw new HttpException(
        'Data could not successfully saved, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return createdData;
  }
}
