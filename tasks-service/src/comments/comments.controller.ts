import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: number,
    @Body('text') text: string,
    @Body('author') author: string,
  ) {
    return this.commentsService.create(+taskId, text, author);
  }

  @Get()
  findAll(@Param('taskId') taskId: number) {
    return this.commentsService.findByTask(+taskId);
  }
}