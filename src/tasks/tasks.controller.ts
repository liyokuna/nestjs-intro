import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks') // prefic for routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): ITask {
    const task: ITask | undefined = this.tasksService.findOne(id);

    if (task) {
      return task;
    }

    throw new NotFoundException();
  }

  @Post()
  public create(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.create(createTaskDto);
  }
}
