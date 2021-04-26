import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor (
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(
        filterDTO: GetTaskFilterDTO,
        user: User,
        ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDTO, user);
    }


    async getTaskById(
        id: number,
        user: User,
        ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id}});

       
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found;
    }


    async createTask(
        createTaskDTO: CreateTaskDTO,
        user: User,
        ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDTO, user)
    }

    async updateTaskStatus(
        id: number, status: TaskStatus,
        user: User,
        ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTaskById(
        id: number,
        user: User,
        ): Promise<any> {
        const res = await this.taskRepository.delete({ id, userId: user.id })

        if(res.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return { message: "Task has been deleted" };
    }

}
