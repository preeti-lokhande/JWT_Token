import { Component } from '@angular/core';
import { Task } from '../../model/task.model';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  imports: [FormsModule, NgForOf],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss',
})
export class TaskManagerComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  task: Task = this.getEmptyTask();
  isEditing = false;
  editIndex: number | null = null;
  priorities: string[] = ['Low', 'Medium', 'High'];
  searchTerm: string = '';

  getEmptyTask(): Task {
    return { id: '', title: '', description: '', dueDate: '', priority: '' };
  }

  onSubmit() {
    if (this.isEditing && this.editIndex !== null) {
      this.tasks[this.editIndex] = { ...this.task };
    } else {
      this.tasks.push({ ...this.task, id: Date.now().toString() });
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

  ngOnInit() {
    this.applyFilter();
  }
}
