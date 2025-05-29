import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from '../common/find-one.params';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDTO } from './create-task-label.dto';
import { UpdateTaskDto } from './update-task.dto';
import { FindTaskParams } from '../common/find-task.params';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';

@Controller('tasks') // prefic for routes
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() filters: FindTaskParams,
    @Query() pagination: PaginationParams,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);

    return {
      data: items,
      meta: {
        total,
        ...pagination,
        //offset: pagination.offset,
        //limit: pagination.limit,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    return await this.tasksService.deleteTask(task);
  }

  @Post('/:id/labels')
  async addLabels(
    @Param() { id }: FindOneParams,
    @Body() labels: CreateTaskLabelDTO[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLabesl(
    @Param() { id }: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.removeLabels(task, labelNames);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task: Task | null = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}
