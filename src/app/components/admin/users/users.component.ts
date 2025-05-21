import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent,NgxPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: any[] = [];
  userForm = { name: '', last_name: '', email: '', role: '', password: '' };
  addUserButton: boolean = false;
  userToEdit: any = null;  // Variable para almacenar la categoría que se está editando
  showPassword: boolean = false;
  loading: boolean = false;

  page:number = 1; // Página actual
  pageSize:number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.users;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.loading = false;
      }
    );
  }

  addUser(): void {

    this.usersService.addUser(this.userForm).subscribe(
      (respuesta) => {
        this.userForm = { name: '', last_name: '', email: '', role: '', password: '' };
        this.loadUsers();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar el usuario:', error);
      }
    );
  }

  editUser(user: any): void {
    // Cargar la categoría para editar
    this.userToEdit = user;
    this.userForm.name = user.name;
    this.userForm.last_name = user.last_name;
    this.userForm.email = user.email;
    this.userForm.role = user.role;
    this.userForm.password = user.password;
    this.addUserButton = true; // Mostrar formulario de edición
  }


  updateUser(): void {
    this.usersService.editUser(this.userToEdit.id, this.userForm).subscribe(
      (respuesta) => {
        this.loadUsers();  // Recargar las categorías
        this.userForm = { name: '', last_name: '', email: '', role: '', password: '' };
        this.addUserButton = false; // Ocultar formulario
        this.userToEdit = null; 
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }


  deleteUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            this.loadUsers();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            console.error('Error al eliminar el usuario:', error);
          }
        );
      }
    });
  }

  cancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.addUserButton = false;
    this.userForm = { name: '', last_name: '', email: '', role: '', password: '' };
    this.userToEdit = null;
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
