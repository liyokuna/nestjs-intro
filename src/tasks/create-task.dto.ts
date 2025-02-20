import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from './task.model';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
