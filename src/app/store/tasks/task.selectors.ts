import { createSelector } from '@ngrx/store';
import { Task } from '../../model/task.model';

export const selectTasks = (state: any) => state.tasks.tasks;
export const selectPendingTasks = createSelector(selectTasks, (tasks) =>
  tasks.filter((t: Task) => t.status === 'Pending')
);
