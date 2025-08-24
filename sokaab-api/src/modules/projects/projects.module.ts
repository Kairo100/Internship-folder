import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/services/prisma.service';
import { CloudinaryService } from 'src/services/cloudinary.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, CloudinaryService],
})
export class ProjectsModule {}
