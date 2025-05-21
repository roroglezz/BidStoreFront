import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ListCategoriesComponent } from '../categories/list-categories/list-categories.component';
import { FavoriteProductsComponent } from '../favorite-products/favorite-products.component';
import { OpinionsComponent } from '../opinions/opinions.component';

@Component({
  selector: 'app-home',
  imports: [CarouselComponent,ListCategoriesComponent,FavoriteProductsComponent,OpinionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
