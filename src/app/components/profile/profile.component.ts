import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, CommonModule,RouterLink,LoadingComponent],
})
export class ProfileComponent {
  user: any;
  isEditing: boolean = false; // Controla el modo de edición
  loading: boolean = false; // Controla el estado de carga

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Cargar los datos del usuario desde la API
  loadUserData() {
    this.loading = true; // Activar el estado de carga
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.usersService.getUser(parseInt(userId, 10)).subscribe(
        (data) => {
          this.user = data.user;
          this.loading = false; // Desactivar el estado de carga
          console.log('usuario', this.user);
        },
        (error) => {
          this.loading = false; // Desactivar el estado de carga
          console.error('Error al cargar los datos del usuario:', error);
        }
      );
    } else {
      console.warn('No se encontró un userId en localStorage.');
    }
  }

  // Activar el modo de edición
  enableEditing() {
    this.isEditing = true;
  }

  // Desactivar el modo de edición
  cancelEditing() {
    this.isEditing = false;
    this.loadUserData(); // Restaurar los datos originales
  }

  // Guardar los datos del usuario después de la edición
  saveUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.usersService.editUser(parseInt(userId, 10), this.user).subscribe(
        (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          this.isEditing = false; // Desactivar el modo de edición después de guardar
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    } else {
      console.warn('No se encontró un userId en localStorage.');
    }
  }
}
