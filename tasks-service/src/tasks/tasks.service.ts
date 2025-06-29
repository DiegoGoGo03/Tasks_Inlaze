import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  create(task: Partial<Task>) {
    const newTask = this.taskRepository.create({
      ...task,
      project: { id: task.projectId }, // esto asocia el proyecto
    });
    return this.taskRepository.save(newTask);
  }

  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async findByProjectId(projectId: number) {
    return this.taskRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      relations: ['project'],
    });
  }


}