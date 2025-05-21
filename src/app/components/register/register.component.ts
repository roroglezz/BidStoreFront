import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = { name: '', last_name: '', email: '', password: '' };

  passwordConfirmation: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.user).subscribe(
      response => {
        Swal.fire('Success', 'Successfully registered user', 'success');
        this.router.navigate(['/login']);
      },
      error => {
        Swal.fire('Error', 'Error registering user ', 'error');
        console.log(error);
      }
    );
  }
}
