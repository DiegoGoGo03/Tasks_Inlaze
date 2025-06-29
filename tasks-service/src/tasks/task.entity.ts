import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Project } from '../projects/project.entity';


@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ default: 'todo' })
  status: 'todo' | 'in_progress' | 'completed';

  @Column({ nullable: true })
  assignedTo: string;

  //Relación inversa
  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[];

  @ManyToOne(() => Project, (project) => project.tasks, { nullable: true })
  project: Project;
  
  @Column()
  projectId: number;
}