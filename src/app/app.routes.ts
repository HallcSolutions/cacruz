import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/world/world.routes').then((m) => m.WORLD_ROUTES),
  },
  {
    path: 'experience',
    loadChildren: () =>
      import('./features/experience/experience.routes').then((m) => m.EXPERIENCE_ROUTES),
  },
  {
    path: 'education',
    loadChildren: () =>
      import('./features/education/education.routes').then((m) => m.EDUCATION_ROUTES),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
  },
  {
    path: 'stack',
    loadChildren: () => import('./features/stack/stack.routes').then((m) => m.STACK_ROUTES),
  },
  {
    path: 'software',
    loadChildren: () =>
      import('./features/software/software.routes').then((m) => m.SOFTWARE_ROUTES),
  },
  {
    path: 'for-companies',
    loadChildren: () => import('./features/value/value.routes').then((m) => m.VALUE_ROUTES),
  },
  {
    path: 'daily',
    loadChildren: () => import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
