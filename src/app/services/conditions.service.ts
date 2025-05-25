import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  protected urlApi = 'http://localhost:8000/api/conditions';

  constructor(private authService: AuthService, private http:HttpClient) { }

  private getHeaders():HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCoditions():Observable<any>{
    return this.http.get(this.urlApi, {headers: this.getHeaders()});
  }

  getCondition(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }

  editCondition(id:number, conditionData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, conditionData, {headers: this.getHeaders()});
  }

  addCondition(conditionData:any):Observable<any>{
    return this.http.post(this.urlApi, conditionData, {headers: this.getHeaders()});
  }

  deleteCondition(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, {headers: this.getHeaders()});
  }

}
