import { Component } from '@angular/core';
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
export class LoginComponent {
  credentials = {email:'', password:''};
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

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
