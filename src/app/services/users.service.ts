import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected urlApi = 'http://localhost:8000/api/users';

  constructor(private authService: AuthService, private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers():Observable<any>{
    return this.http.get(this.urlApi, { headers: this.getHeaders() });
  }

  getUser(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  addUser(userData:any):Observable<any>{
    return this.http.post(this.urlApi, userData, { headers: this.getHeaders() });
  }

  editUser(id:number, userData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, userData, { headers: this.getHeaders() });
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }


}
