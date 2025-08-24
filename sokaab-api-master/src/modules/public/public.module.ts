import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { ProjectsService } from '../projects/projects.service';
import { PrismaService } from 'src/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryProvider } from 'src/providers/cloudinary.provider';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 50000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [PublicController],
  providers: [
    PublicService,
    ProjectsService,
    PrismaService,
    CloudinaryProvider,
  ],
})
export class PublicModule {}
