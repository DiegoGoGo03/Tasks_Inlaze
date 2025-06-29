import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  findAll() {
    return this.projectRepo.find({ relations: ['tasks'] });
  }

  findOne(id: number) {
    return this.projectRepo.findOne({ where: { id }, relations: ['tasks'] });
  }
}
