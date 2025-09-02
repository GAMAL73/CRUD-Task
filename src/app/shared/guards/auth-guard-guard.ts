import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
    let _AuthService:Auth =inject(Auth);
    let _Router:Router=inject(Router)
  if(_AuthService.userdata.getValue() !=null){
    return true;
  }
  _Router.navigate(['/login'])
  return false;
};
  