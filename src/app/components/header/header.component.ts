import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { MessagesService } from '../../services/messages.service';
import { Subscription, interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, FormsModule, CommonModule,ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  isLoading: boolean = true;
  showMobileMenu: boolean = false;
  showCategoryMenu: boolean = false;
  unreadMessagesCount: number = 0;
  private messageSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private categoriesService: CategoriesService,
    private messagesService: MessagesService
  ) { }

  ngOnInit() {
    this.checkLoginStatusAndFetchCategories();
    this.initializeMessageCounter();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  // Método para inicializar el contador de mensajes
  initializeMessageCounter() {
    if (this.authService.isLoggedIn()) {
      // Obtener el recuento inicial
      this.fetchUnreadMessagesCount();

      // Configurar una actualización periódica (cada 30 segundos)
      this.messageSubscription = interval(30000).pipe(
        switchMap(() => {
          if (this.authService.isLoggedIn()) {
            const userId = parseInt(localStorage.getItem('userId') || '', 10);
            if (userId) {
              return this.messagesService.getUserMessages(userId);
            }
          }
          return of(null); // Retornar un Observable con valor null si no hay usuario
        })
      ).subscribe(
        (data: any) => {
          if (data && data.messages) {
            this.unreadMessagesCount = data.messages.filter((msg: any) => !msg.readed).length;
          }
        },
        (error) => {
          console.error('Error en actualización periódica de mensajes:', error);
        }
      );
    }
  }

  // Método para obtener el número de mensajes no leídos
  fetchUnreadMessagesCount() {
    const userId = parseInt(localStorage.getItem('userId') || '', 10);
    if (userId) {
      return this.messagesService.getUserMessages(userId).subscribe(
        (data: any) => {
          if (data && data.messages) {
            this.unreadMessagesCount = data.messages.filter((msg: any) => !msg.readed).length;
          }
        },
        (error) => {
          console.error('Error fetching unread messages:', error);
        }
      );
    }
    return [];
  }

  // Método que verifica si el usuario está logeado y luego obtiene las categorías
  checkLoginStatusAndFetchCategories() {
    if (this.authService.isLoggedIn()) {
      this.getCategories();
    } else {
      this.isLoading = false;
    }
  }

  // Método para obtener las categorías
  getCategories() {
    this.categoriesService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categories;
        this.isLoading = false;  // Dejar de cargar una vez que se obtienen las categorías
      },
      (error) => {
        console.error('Error al obtener categorías', error);
        this.isLoading = false;  // Dejar de cargar incluso si hay un error
      }
    );
  }

  logout() {
    this.authService.logoutUser();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;

    // Bloquear el desplazamiento del body cuando el menú está abierto
    if (this.showMobileMenu) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      // Cerrar el submenú de categorías si está abierto
      this.showCategoryMenu = false;
    }
  }

  toggleCategoryMenu(): void {
    this.showCategoryMenu = !this.showCategoryMenu;
  }
}