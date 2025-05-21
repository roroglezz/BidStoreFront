import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  protected urlApi = 'http://localhost:8000/api/forms';

  protected urlResponsesApi = 'http://localhost:8000/api/form-responses';

  constructor(private authService: AuthService, private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getForms(): Observable<any> {
    return this.http.get(this.urlApi, { headers: this.getHeaders() });
  }

  getForm(id: number): Observable<any> {
    return this.http.get(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  editForm(id: number, formData: any): Observable<any> {
    return this.http.put(`${this.urlApi}/${id}`, formData, { headers: this.getHeaders() });
  }

  addForm(formData: any): Observable<any> {
    return this.http.post(this.urlApi, formData, { headers: this.getHeaders() });
  }

  deleteForm(id: number): Observable<any> {
    return this.http.delete(`${this.urlApi}/${id}`, { headers: this.getHeaders() });
  }

  //Funciones para las respuestas de los formularios
  getFormResponses(formId: number): Observable<any> {
    return this.http.get(`${this.urlApi}/${formId}/responses`, { headers: this.getHeaders() });
  }

  getAllFormResponses(): Observable<any> {
    return this.http.get(this.urlResponsesApi, { headers: this.getHeaders() });
  }

  addFormResponse(responseData: any): Observable<any> {
    return this.http.post(this.urlResponsesApi, responseData, { headers: this.getHeaders() });
  }

  updateFormResponse(responseId: number, responseData: any): Observable<any> {
    return this.http.put(`${this.urlResponsesApi}/${responseId}`, responseData, { headers: this.getHeaders() });
  }

  deleteFormResponse(responseId: number): Observable<any> {
    return this.http.delete(`${this.urlResponsesApi}/${responseId}`, { headers: this.getHeaders() });
  }
}
