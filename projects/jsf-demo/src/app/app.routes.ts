import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./api-example/api-example.component').then(m => m.ApiExampleComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
