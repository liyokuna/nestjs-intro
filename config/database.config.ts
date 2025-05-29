import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TaskLabel } from '../src/tasks/task-label.entity';
import { Task } from '../src/tasks/task.entity';
import { User } from '../src/users/user.entity';

export const typeOrmConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'tasks',
    entities: [Task, User, TaskLabel],
    synchronize: Boolean(process.env.DB_SYNC ?? false),
  }),
);
