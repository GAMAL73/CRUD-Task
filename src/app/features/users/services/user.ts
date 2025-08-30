import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User_interface } from '../../../models/user.model';
import { Environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class User {

  private apiUrl = `${Environment.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: User_interface): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  createUser(user: Omit<User_interface, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
