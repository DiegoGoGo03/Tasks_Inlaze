import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async create(task: Partial<Task>) {

    console.log("Task recibido en service.create:", task);
    console.log("projectId en service.create:", task.projectId);
    
    if (task.projectId === undefined || task.projectId === null) {
      throw new BadRequestException('Project ID is required.');
    }
    const newTask = this.taskRepository.create({
      ...task,
      projectId: task.projectId, // esto asocia el proyecto
    });
    try {
      return await this.taskRepository.save(newTask);
    } catch (error) {
      console.error("Error al guardar la tarea en DB:", error.message || error);
      // Puedes relanzar el error o lanzar una excepción más amigable
      throw error; // Para que el stack trace completo se muestre
    }
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