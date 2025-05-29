import { Injectable, Search } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateTaskLabelDTO } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from '../common/find-task.params';
import { PaginationParams } from '../common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly taskLabelRepository: Repository<TaskLabel>,
  ) {}

  async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams,
  ): Promise<[Task[], number]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');
    const where: FindOptionsWhere<Task> = {};

    if (filters.status) {
      query.andWhere('task.status= :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...names)', { names: filters.labels })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);
      query.andWhere('labels.name IN(:...names)', { names: filters.labels });
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();

    return await this.tasksRepository.findAndCount({
      where,
      relations: ['labels'],
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  async updateTask(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async addLabels(task: Task, labelDtos: CreateTaskLabelDTO[]): Promise<Task> {
    const names = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelDtos)
      .filter((dto) => !names.has(dto.name))
      .map((label) => this.taskLabelRepository.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.tasksRepository.save(task);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }

    return await this.tasksRepository.save(createTaskDto);
  }

  async removeLabels(task: Task, labelsToRemove: string[]): Promise<Task> {
    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );

    return await this.taskLabelRepository.save(task);
  }

  async deleteTask(task: Task): Promise<void> {
    // remove can be use for not cascade repository
    await this.tasksRepository.delete(task.id);
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDTO[],
  ): CreateTaskLabelDTO[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];

    return uniqueNames.map((name) => ({ name }));
  }
}
