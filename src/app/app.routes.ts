import { Routes } from '@angular/router';
import { UserList } from './features/users/components/user-list/user-list';
import { UserDetail } from './features/users/components/user-detail/user-detail';
import { UserEdit } from './features/users/components/user-edit/user-edit';
import { UserCreat } from './features/users/components/user-creat/user-creat';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { ForgetPassword } from './features/auth/forget-password/forget-password';
import { authGuardGuard } from './shared/guards/auth-guard-guard';
import { ResetCode } from './features/auth/reset-code/reset-code';
import { NewPass } from './features/auth/new-pass/new-pass';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserList,canActivate:[authGuardGuard]},
  { path: 'users/:id', component: UserDetail ,canActivate:[authGuardGuard]},
  { path: 'users/edit/:id', component: UserEdit ,canActivate:[authGuardGuard]},
  {path: 'Register', component: Register},
  {path: 'login', component: Login},
  {path: 'forgetPass', component: ForgetPassword},
  {path: 'resetCode',component:ResetCode},
  {path: 'newPass',component:NewPass},
  {path: 'create', component: UserCreat,canActivate:[authGuardGuard]},

  { path: '**', redirectTo: 'users' }
];
