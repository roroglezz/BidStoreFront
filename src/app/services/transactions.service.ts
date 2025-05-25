import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  protected urlApi = 'http://localhost:8000/api/users/transactions';

  constructor(private authService: AuthService, private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  public makeTransaction(user_id: number, amount:number):Observable<any>{
    return this.http.post(`${this.urlApi}/${user_id}`,{user_id,amount}, { headers: this.getHeaders() });
  }

  public getTransactions(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }
}
