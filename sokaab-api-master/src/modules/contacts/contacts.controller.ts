import { Controller, Get, Post, Body, UsePipes, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ContactsService } from './contacts.service';
import { CreateContactsSchema, CreateContactsDto } from './dto/dtos';
import { ZodValidationPipe } from 'src/validations/zod';
import { PrismaService } from 'src/services/prisma.service';
import { Public } from 'src/middlewares/public.decorator';
import { platformEntity } from 'src/constants';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly prismaService: PrismaService,
  ) {}

  //** Contacts */
  @Get()
  async fetch(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    const where: Prisma.Contact_dataWhereInput = {};

    const parsedTake = Number(take) || 5;
    const parsedSkip = Number(skip) > 0 ? (Number(skip) - 1) * parsedTake : 0;

    if (search) {
      where.OR = [
        // { id: { equals: Number(search) } },
        { name: { contains: search } },
        { contact_reason: { contains: search } },
        { email_address: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const contacts = await this.contactsService.fetchContacts({
      skip: parsedSkip,
      take: parsedTake,
      where,
    });

    return contacts;
  }

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe(CreateContactsSchema))
  async createContact(@Body() createContactsDto: CreateContactsDto) {
    const dataInput: Prisma.Contact_dataCreateInput = {
      ...createContactsDto,
      added_by: 'Public',
      entity_id: platformEntity,
      added_on: new Date(),
    };

    const createdData = await this.contactsService.createContact(dataInput);

    return {
      statusCode: 200,
      message: 'Data successfully saved',
      data: createdData,
    };
  }
}
