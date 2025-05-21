import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteproductsService {

  protected urlApi = 'http://localhost:8000/api/favoriteproducts';

  constructor(private authService:AuthService, private http:HttpClient) { }

  private getHeaders():HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getFavoriteProducts():Observable<any>{
    return this.http.get(this.urlApi, {headers: this.getHeaders()});
  }

  getFavoriteProduct(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }

  addFavoriteProduct(favoriteData: { user_id: number; product_id: number }):Observable<any>{
    return this.http.post(this.urlApi, favoriteData, {headers:this.getHeaders()});
  }

  editFavoriteProduct(id:number, favoriteProductData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, favoriteProductData, {headers:this.getHeaders()});
  }

  deleteFavoriteProduct(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }
}
