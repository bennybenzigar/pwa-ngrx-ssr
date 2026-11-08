import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'counter'
  },
  {
    path: 'counter',
    loadComponent: () => import('./components/counter/counter').then(m => m.Counter)
  },
  {path:'users',
    loadComponent:()=> import('./components/user/users/users').then((m)=>m.Users)
  },
  {path:'user-details/:id',
    loadComponent:()=> import('./components/user/user-details/user-details').then((m)=>m.UserDetails)
  },
  {
    path:'create-user',
    loadComponent:()=> import('./components/user/create-user/create-user').then((m)=>m.CreateUser)
  },
  {
    path:'user-ngrx',
    loadComponent:()=> import('./components/user-ngrx/user-ngrx').then((m)=> m.UserNgrx)
  }
];
