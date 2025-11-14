import type { IDataAdapter } from '../adapters/IDataAdapter';
import type { RawTaskData } from '../adapters/types';
import type { Task } from '../types';

export class TaskService {
  private adapter: IDataAdapter<RawTaskData>;

  constructor(adapter: IDataAdapter<RawTaskData>) {
    this.adapter = adapter;
  }

  async getTasks(): Promise<Task[]> {
    const rawData = await this.adapter.fetchAll();
    return rawData.tasks;
  }

  async getTasksForPage(pageId: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.pageId === pageId);
  }

  async getLowCompletionTasks(threshold: number): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.contentMeta.completionRate < threshold);
  }

  async getActiveTasks(): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.contentMeta.status === 'ACTIVE');
  }

  async getTasksByType(taskType: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.contentMeta.taskType === taskType);
  }

  async getHighAbandonmentTasks(threshold: number): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter((t) => t.contentMeta.abandonmentRate > threshold);
  }
}
