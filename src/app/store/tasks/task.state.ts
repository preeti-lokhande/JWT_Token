import { Task } from '../../model/task.model';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
};
