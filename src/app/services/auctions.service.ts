import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {

  protected urlApi = 'http://localhost:8000/api/auctions';

  constructor(private authService:AuthService, private http:HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAuctions():Observable<any>{
    return this.http.get(this.urlApi, { headers: this.getHeaders() });
  }

  getAuction(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  addAuction(auctionData:any):Observable<any>{
    return this.http.post(this.urlApi, auctionData, { headers: this.getHeaders() });
  }

  editAuction(id:number, auctionData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, auctionData, { headers: this.getHeaders() });
  }

  deleteAuction(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  makeBid(id:number, bidData:any):Observable<any>{
    return this.http.post(`${this.urlApi}/bids/${id}`, {
      auction_price: bidData.auction_price,
      buyer_id: bidData.buyer_id
    }, { headers: this.getHeaders() });
  }

  closeAuction(id: number): Observable<any> {
    return this.http.post(`${this.urlApi}/${id}/close`, {}, { headers: this.getHeaders() });
  }
  checkExpiredAuctions(): Observable<any> {
    return this.http.post(`${this.urlApi}/check-expired`, {}, { headers: this.getHeaders() });
  }
}
