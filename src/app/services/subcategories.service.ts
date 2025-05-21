import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  protected urlApi = 'http://localhost:8000/api/subcategories';

  constructor(private authService:AuthService, private http:HttpClient) { }

  private getHeaders():HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSubcategories():Observable<any> {
    return this.http.get(this.urlApi,{headers: this.getHeaders()});
  }

  getSubcategory(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`,{headers: this.getHeaders()});
  }

  addSubcategory(subcategoryData:any):Observable<any>{
    return this.http.post(this.urlApi, subcategoryData, {headers: this.getHeaders()});
  }

  editSubcategory(id:number, subcategoryData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, subcategoryData, {headers: this.getHeaders()});
  }

  deleteSubcategory(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, {headers: this.getHeaders()});
  }
}
