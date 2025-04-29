import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-manager',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss',
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  task: Task = this.getEmptyTask();
  isEditing = false;
  editIndex: number | null = null;
  priorities: string[] = ['Low', 'Medium', 'High'];
  searchTerm: string = '';
  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.applyFilter();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
    });
  }

  getEmptyTask(): Task {
    return { id: '', title: '', description: '', dueDate: '', priority: '' };
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if (this.isEditing && this.editIndex !== null) {
        // update task logic
        this.tasks[this.editIndex] = { ...this.task };
      } else {
        // create task logic
        this.tasks.push({ ...this.task, id: Date.now().toString() });
      }
    } else {
      this.taskForm.markAllAsTouched(); // show validation errors
    }
    this.applyFilter();
    this.resetForm();
  }

  editTask(index: number) {
    this.task = { ...this.filteredTasks[index] };
    this.editIndex = this.tasks.findIndex((t) => t.id === this.task.id);
    this.isEditing = true;
  }

  deleteTask(index: number) {
    const taskId = this.filteredTasks[index].id;
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      this.applyFilter();
      this.resetForm();
    }
  }

  resetForm() {
    this.task = this.getEmptyTask();
    this.isEditing = false;
    this.editIndex = null;
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.priority.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.applyFilter();
  }

  trackByIndex(index: number): number {
    return index;
  }
}
