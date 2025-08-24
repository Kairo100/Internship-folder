import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [OrganisationsController],
  providers: [OrganisationsService, PrismaService],
})
export class OrganisationsModule {}
