import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  showPassword = false;
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Detectar preferencia del sistema o configuración guardada
    this.loadDarkModePreference();
  }

  loadDarkModePreference(): void {
    // Verificar si hay una preferencia guardada en localStorage
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference) {
      this.isDarkMode = savedPreference === 'true';
    } else {
      // Si no hay preferencia guardada, usar la preferencia del sistema
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  login(){
    this.authService.login(this.credentials).subscribe(
      response => {
        this.authService.saveToken(response['token']);
        this.authService.saveUserId(response['user_id']);
        this.authService.saveUserRole(response['user_role']);
        this.router.navigate(['/home']);
      },
      error => {
        Swal.fire({
          title: '¡Invalid!',
          text: 'Credentials are invalid.',
          icon: 'error',
          confirmButtonText: 'Acept'
        });
      }
    );
  }
}