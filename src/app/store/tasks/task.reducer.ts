import { createReducer, on } from '@ngrx/store';
import {
  addTask,
  deleteTask,
  loadTasks,
  loadTasksSuccess,
  updateTask,
} from './task.actions';
import { initialState } from './task.state';

export const taskReducer = createReducer(
  initialState,
  on(loadTasks, (state) => ({ ...state, loading: true })),
  on(loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
  }))
);
