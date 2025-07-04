import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService], // Exporta si otros módulos necesitan usarlo
})
export class ProjectsModule {}
