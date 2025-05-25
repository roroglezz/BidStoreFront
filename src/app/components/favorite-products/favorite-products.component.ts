import { Component } from '@angular/core';
import { FavoriteproductsService } from '../../services/favoriteproducts.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorite-products',
  imports: [CommonModule,RouterLink],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.css'
})
export class FavoriteProductsComponent {
  favoriteProducts:any[] = [];

  constructor(private favoriteproductsService: FavoriteproductsService) {}

  ngOnInit() {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts() {
    const userId = localStorage.getItem('userId');
    this.favoriteProducts = [];
    if (userId) {
      this.favoriteproductsService.getFavoriteProducts().subscribe(
        (data) => {
          for (let favorite of data.favoriteProducts) {
            // Comprueba si el user_id coincide con el userId del localStorage
            if (favorite.user_id === parseInt(userId, 10)&&!favorite.product.buyer_id) {
              this.favoriteProducts.push(favorite.product);
            }
          }
        },
        (error) => {
          console.error('Error al cargar los productos favoritos:', error);
        }
      );
    } else {
      console.warn('No se encontró un userId en localStorage.');
    }
  }
}
