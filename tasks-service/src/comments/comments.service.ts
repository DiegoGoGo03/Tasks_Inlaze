import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Task } from '../tasks/task.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async create(taskId: number, text: string, author: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');

    const newComment = this.commentRepo.create({
      content: text,
      author,
      task,
    });
    return this.commentRepo.save(newComment);
  }

  async findByTask(taskId: number) {
    return this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ['task'],
    });
  }
}