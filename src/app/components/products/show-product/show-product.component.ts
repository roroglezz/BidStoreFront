import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { FavoriteproductsService } from '../../../services/favoriteproducts.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../../services/messages.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-product',
  imports: [CommonModule, LoadingComponent, FormsModule, RouterLink],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css'
})
export class ShowProductComponent {
  productId!: number;
  product: any;
  loading: boolean = true;
  buyData: any = {product_id: 0, user_id: 0};
  messageData: any = { subject: '', message: '', product_id: 0, user_id: 0 };

  constructor(private route: ActivatedRoute, private productService: ProductsService, private messagesService: MessagesService, private favoriteProduct:FavoriteproductsService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loading = true;
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        this.product = data.product;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  buyProduct() {
    // Obtener el user_id del localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('Usuario no autenticado');
      // Aquí podrías redirigir al login o mostrar un mensaje
      return;
    }
    
    this.buyData = {
      product_id: this.product.id,
      user_id: parseInt(userId, 10)
    };
    
    this.productService.buyProduct(this.buyData).subscribe(
      (data) => {
        Swal.fire({
          title: 'Compra exitosa',
          text: 'El producto ha sido comprado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
        // Enviar mensaje automático de confirmación
        this.createMessage();
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  createMessage(): void {
    // Obtener el ID de usuario del localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId || !this.product) {
      return;
    }
    
    this.loading = true;
    
    // Configurar los datos del mensaje
    this.messageData = {
      subject: `Has comprado ${this.product.name}`,
      message: `¡Gracias por tu compra! Tu compra de ${this.product.name} ha sido procesada correctamente. Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.`,
      product_id: this.product.id,
      user_id: parseInt(userId, 10)
    };
    
    this.messagesService.addMessage(this.messageData).subscribe(
      (data: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Mensaje enviado',
          text: 'Se ha creado un mensaje de confirmación de tu compra.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      (error) => {
        console.error('Error al crear mensaje de confirmación:', error);
        this.loading = false;
      }
    );
  }

  makeFavorite() {
    // Obtener el ID del usuario actualmente logueado desde localStorage
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      Swal.fire({
        title: 'Error',
        text: 'Debes iniciar sesión para añadir productos a favoritos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    this.favoriteProduct.addFavoriteProduct({
      product_id: this.product.id, 
      user_id: parseInt(userId, 10)
    }).subscribe(
      (data) => {
        Swal.fire({
          title: 'Producto favorito',
          text: 'El producto ha sido añadido a favoritos.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.message || 'No se pudo añadir a favoritos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  
}