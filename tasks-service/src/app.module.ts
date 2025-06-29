import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Task } from './tasks/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { Comment } from './comments/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { Project } from './projects/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Task, Comment, Project],
      synchronize: true,
    }),
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}