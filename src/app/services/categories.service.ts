import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  protected urlApi = 'http://localhost:8000/api/categories';

  constructor(private http:HttpClient, private authService:AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCategories():Observable<any> {
    return this.http.get(this.urlApi, { headers: this.getHeaders() });
  }

  getCategory(id:number):Observable<any> {
    return this.http.get(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  addCategory(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(this.urlApi, formData, { headers });
  }

  editCategory(id: number, formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.urlApi}/${id}`, formData, { headers });
  }
  

  deleteCategory(id:number):Observable<any> {
    return this.http.delete(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }
}
