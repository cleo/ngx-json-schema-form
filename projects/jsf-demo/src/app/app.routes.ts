import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./api-example/api-example.component').then(m => m.ApiExampleComponent)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./user-details/user-details.component').then(m => m.UserDetailsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
