import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  protected urlApi = 'http://localhost:8000/api/messages';

  constructor(private authService: AuthService, private http:HttpClient) { }

  private getHeaders():HttpHeaders{
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMessages():Observable<any>{
    return this.http.get(this.urlApi, {headers: this.getHeaders()});
  }

  getUserMessages(id:number):Observable<any>{
    return this.http.get(`${this.urlApi}/${id}`, {headers:this.getHeaders()});
  }

  addMessage(messageData:any):Observable<any>{
    return this.http.post(this.urlApi, messageData, {headers: this.getHeaders()});
  }

  editMessage(id:number, messageData:any):Observable<any>{
    return this.http.put(`${this.urlApi}/${id}`, messageData, {headers: this.getHeaders()});
  }

  deleteMessage(id:number):Observable<any>{
    return this.http.delete(`${this.urlApi}/${id}`, {headers: this.getHeaders()});
  }

  readedMessage(id:number):Observable<any>{
    return this.http.put(`${this.urlApi}/readed/${id}`, {}, {headers: this.getHeaders()});
  }

  broadcastMessage(messageData:any):Observable<any>{
    return this.http.post(`${this.urlApi}/broadcastMessage`, messageData, {headers: this.getHeaders()});
  }
}
