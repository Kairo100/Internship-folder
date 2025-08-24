import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaService } from 'src/services/prisma.service';
import { ProjectsService } from '../projects/projects.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, ProjectsService],
})
export class StatisticsModule {}
