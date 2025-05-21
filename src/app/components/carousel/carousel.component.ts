import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  products: any[] = [];
  featuredProducts: any[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data.products;

      // Get featured products (you can customize this logic)
      this.featuredProducts = this.getFeaturedProducts();

      // Initialize Bootstrap carousel after data is loaded
      this.initCarousel();
    });
  }

  getFeaturedProducts() {
    // Filter products - showing top 5 products by offer price (adjust as needed)
    return this.products
      .filter(product => !product.buyer_id && product.image_url) // Only available products with images
      .sort((a, b) => b.offer_price - a.offer_price) // Sort by highest price
      .slice(0, 5); // Take top 5
  }

  initCarousel() {
    // Initialize Bootstrap carousel - this requires Bootstrap JS
    setTimeout(() => {
      // @ts-ignore
      if (typeof bootstrap !== 'undefined') {
        // @ts-ignore
        const carousel = new bootstrap.Carousel(document.getElementById('featuredProductsCarousel'), {
          interval: 5000, // Auto-rotate every 5 seconds
          wrap: true,
          touch: true
        });
      }
    }, 100);
  }
}