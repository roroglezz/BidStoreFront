import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlApi = 'http://localhost:8000/api';
  
  constructor(private http:HttpClient) { }

  register(userData:any):Observable<any> {
    return this.http.post(`${this.urlApi}/register`, userData);
  }

  login(credentials:any):Observable<any> {
    return this.http.post(`${this.urlApi}/login`, credentials);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error('No token found'));

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.urlApi}/logout`, {}, { headers });
  }

  saveToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  saveUserId(userId: number): void {
    return localStorage.setItem('userId', userId.toString());
  }

  saveUserRole(userRole: string): void {
    return localStorage.setItem('userRole', userRole);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getToken():string|null{
    if(localStorage){
      return localStorage.getItem('token');
    }else{
      return null;
    }
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin():boolean{
    const role = this.getUserRole();
    return role == 'administrator';

  }


  logoutUser(): void {
    console.log(localStorage.getItem('token'));
    this.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        window.location.href = '/login'; // Redirige al login
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
