import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'task',
    loadComponent: () =>
      import('./components/task-manager/task-manager.component').then(
        (m) => m.TaskManagerComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
