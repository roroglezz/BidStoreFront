import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../../services/messages.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersService } from '../../../services/users.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-messages-admin',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, NgxPaginationModule],
  templateUrl: './messages-admin.component.html',
  styleUrl: './messages-admin.component.css'
})

export class MessagesAdminComponent {
  
  messages: any[] = [];
  users: any[] = [];
  products: any[] = [];
  messageForm: { subject: string, message: string, readed: boolean, user_id: number | string, product_id: number } = 
  { subject: '', message: '', readed: false, user_id: 0, product_id: 0 };
  addMessageButton: boolean = false;
  messageToEdit: any = null;

  loading: boolean = false;

  page: number = 1; // Página actual
  pageSize: number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private messageService: MessagesService, private usersService: UsersService, private productsService: ProductsService) { }

  ngOnInit() {
    this.loadMessages();
    this.loadUsers();
    this.loadProducts();
  }

  loadMessages() {
    this.loading = true;

    this.messageService.getMessages().subscribe(
      (data) => {
        this.messages = data.messages;
        this.loading = false;
      }, (error) => {
        console.error('Error al obtener los mensajes:', error);
        this.loading = false;
      }
    );
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

  loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe(
      (data) => {
        this.products = data.products;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.loading = false;
      }
    );
  }

  addMessage(): void {
    this.messageService.addMessage(this.messageForm).subscribe(
      (response) => {
        this.messageForm = { subject: '', message: '', readed: false, user_id: 0, product_id: 0 };
        this.loadMessages();
        this.resetForm();
      }, (error) => {
        console.error('Error al agregar el mensaje:', error);
      }
    );
  }

  submitMessage(): void {
    console.log('Submit called with user_id:', this.messageForm.user_id, 'Type:', typeof this.messageForm.user_id);
    
    if (this.messageToEdit) {
      this.updateMessage();
      return;
    }
  
    // Usando toString para hacer la comparación más robusta
    if (String(this.messageForm.user_id) === 'all') {
      console.log('Enviando a todos los usuarios');
      this.addMessageToAllUsers();
    } else {
      console.log('Enviando a usuario individual');
      this.addMessage();
    }
  }

  // Método para enviar mensaje a todos los usuarios
  addMessageToAllUsers(): void {
    // Mostrar indicador de carga
    this.loading = true;
  
    // Crear una copia del formulario sin el ID de usuario
    const messageData = {
      subject: this.messageForm.subject,
      message: this.messageForm.message,
      readed: this.messageForm.readed,
      product_id: this.messageForm.product_id
      // No necesitamos incluir user_id: 'all' si el backend no lo espera
    };
  
    // Usar el método broadcastMessage que ya existe en tu servicio
    this.messageService.broadcastMessage(messageData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Message has been sent to all users',
          icon: 'success',
          confirmButtonColor: '#4f46e5'
        });
        this.loadMessages();
        this.resetForm();
        this.loading = false;
      },
      (error) => {
        console.log('Error sending message to all users:', error);
        Swal.fire({
          title: 'Error',
          text: 'Could not send message to all users',
          icon: 'error',
          confirmButtonColor: '#4f46e5'
        });
        this.loading = false;
      }
    );
  }

  editMessage(message: any): void {
    // Cargar la categoría para editar
    this.messageToEdit = message;
    this.messageForm.subject = message.subject;
    this.messageForm.message = message.message;
    this.messageForm.readed = message.readed;
    this.messageForm.user_id = message.user_id;
    this.messageForm.product_id = message.product_id;
    this.addMessageButton = true; // Mostrar formulario de edición
  }

  updateMessage(): void {
    this.messageService.editMessage(this.messageToEdit.id, this.messageForm).subscribe(
      (response) => {
        this.messageForm = { subject: '', message: '', readed: false, user_id: 0, product_id: 0 };
        this.loadMessages();
        this.resetForm();
      }, (error) => {
        console.error('Error al editar el mensaje:', error);
      }
    );
  }

  deleteMessage(id: number): void {
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
        this.messageService.deleteMessage(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'El mensaje ha sido eliminado.', 'success');
            this.loadMessages();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error');
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
    this.addMessageButton = false;
    this.messageForm = { subject: '', message: '', readed: false, user_id: 0, product_id: 0 };
    this.messageToEdit = null;
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
