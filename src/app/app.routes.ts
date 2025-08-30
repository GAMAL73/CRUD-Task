import { Routes } from '@angular/router';
import { UserList } from './features/users/components/user-list/user-list';
import { UserDetail } from './features/users/components/user-detail/user-detail';
import { UserEdit } from './features/users/components/user-edit/user-edit';
import { UserCreat } from './features/users/components/user-creat/user-creat';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserList },
  { path: 'users/:id', component: UserDetail },
  { path: 'users/edit/:id', component: UserEdit },
  {path: 'create', component: UserCreat},
  { path: '**', redirectTo: 'users' }
];
