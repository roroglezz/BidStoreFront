import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  protected urlApi = 'http://localhost:8000/api/products';

  constructor(private authService:AuthService, private http:HttpClient) { }

  private getHeaders():HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProducts():Observable<any>{
    return this.http.get(this.urlApi, {headers: this.getHeaders()});
  }

  getProduct(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }

  addProduct(formData: FormData):Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.urlApi, formData, {headers});
  }

  editProduct(id:number, formData: FormData):Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.urlApi}/${id}`, formData, {headers});
  }

  deleteProduct(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }

  buyProduct(data:any):Observable<any>{
    return this.http.post('http://localhost:8000/api/products/buy', data, {headers:this.getHeaders()});
  }
}
