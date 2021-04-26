import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.pipes';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
        @GetUser() user: User,
        ): Promise<Task[]> {
            this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDTO)}`)
       return this.tasksService.getTasks(filterDTO, user)
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User
        ): Promise<Task> {
            this.logger.verbose(`User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDTO)}`)
        return this.tasksService.createTask(createTaskDTO, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user)
    }

    @Delete('/:id')
    deleteTaskById(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<void> {
      return this.tasksService.deleteTaskById(id, user)
    }
}
