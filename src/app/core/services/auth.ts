import { HttpClient } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { registerData, LogInData, code, EmailData, newPassword } from '../../models/data';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class Auth {
  userdata:BehaviorSubject<any>=new BehaviorSubject(null);
  private _Router:Router=inject(Router)
  constructor(private _HttpClient:HttpClient) { }
  signUp(data:registerData):Observable<any>
    {
      return this._HttpClient.post(`${Environment.authUrl}/api/v1/auth/signup`,data);
    }
  signin(data:LogInData):Observable<any>
    {
      return this._HttpClient.post(`${Environment.authUrl}/api/v1/auth/signin`,data);
    }
  forgetPassword(data:EmailData):Observable<any>
  {
    return this._HttpClient.post(`${Environment.authUrl}/api/v1/auth/forgotPasswords`,data);
  }
  resetCode(data:code):Observable<any>
  {
    return this._HttpClient.post(`${Environment.authUrl}/api/v1/auth/verifyResetCode`,data);
  }
  resetNewPassword(data:newPassword):Observable<any>
  {
    return this._HttpClient.put(`${Environment.authUrl}/api/v1/auth/resetPassword`,data);
  }
  decodeUserData(){
  const token =JSON.stringify(localStorage.getItem('userToken'));
  const decoded = jwtDecode(token);
  this.userdata.next(decoded);
  console.log(this.userdata.getValue());
  }
  logOut(){
  localStorage.removeItem('userToken');
  this.userdata.next(null);
  this._Router.navigate(['/login'])
  }
}
