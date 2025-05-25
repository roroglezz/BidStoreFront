import { Component } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { title } from 'node:process';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  messages: any[] = [];
  filteredMessages: any[] = []; // Nueva propiedad para los mensajes filtrados
  userId: any;
  loading: boolean = false;
  activeFilter: string = 'all'; // Nuevo: para rastrear el filtro activo
  searchTerm: string = ''; // Nuevo: para la búsqueda

  page: number = 1; // Página actual
  pageSize: number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(): any {
    this.loading = true;
    this.userId = localStorage.getItem('userId');
    this.messagesService.getUserMessages(this.userId).subscribe(
      (data: any) => {
        this.messages = data.messages;
        console.log(this.messages);
        this.applyFilters(); // Aplicar filtros después de cargar los mensajes
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  // Nuevo método para filtrar mensajes
  applyFilters(): void {
    // Primero aplicamos el filtro de estado (todos, leídos, no leídos)
    let result = [...this.messages];

    if (this.activeFilter === 'read') {
      result = this.messages.filter(message => message.readed);
    } else if (this.activeFilter === 'unread') {
      result = this.messages.filter(message => !message.readed);
    }

    // Luego aplicamos el filtro de búsqueda si existe
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(message =>
        message.subject.toLowerCase().includes(term) ||
        message.message.toLowerCase().includes(term) ||
        (message.product && message.product.name.toLowerCase().includes(term))
      );
    }

    this.filteredMessages = result;
  }

  // Método para cambiar el filtro activo
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  // Método para manejar la búsqueda
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  markAsRead(messageId: number): any {
    this.loading = true;
    this.messagesService.readedMessage(messageId).subscribe(
      (data: any) => {
        this.loadMessages();
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }

  deleteMessage(messageId: number): any {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.messagesService.deleteMessage(messageId).subscribe(
          (data: any) => {
            this.loadMessages();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
}