import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FavoriteproductsService } from '../../../services/favoriteproducts.service';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterLink, LoadingComponent],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent {
  categoryId!: number;
  category: any;
  subcategories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];

  searchTerm: string = '';
  selectedSubcategory: number | null = null;

  // Variables para la paginación
  page: number = 1;
  pageSize: number = 4;
  pageSizeOptions: number[] = [4, 6, 9, 12];

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private productsService: ProductsService,
    private favorite: FavoriteproductsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.loadCategoryData();
    });
  }

  loadCategoryData() {
    this.loading = true;
    this.categoriesService.getCategory(this.categoryId).subscribe(
      (data) => {
        this.category = data.category;
        this.loadSubcategories();
      },
      (error) => {
        console.error('Error al cargar la categoría:', error);
        this.loading = false;
      }
    );
  }

  loadSubcategories() {
    this.subcategories = [];
    this.subcategoriesService.getSubcategories().subscribe(
      (data) => {
        for (let subcategory of data.subcategories) {
          if (subcategory.category_id == this.categoryId) {
            this.subcategories.push(subcategory);
          }
        }
        this.loadProducts();
      },
      (error) => {
        console.error('Error al cargar las subcategorías:', error);
        this.loading = false;
      }
    );
  }

  loadProducts() {
    this.products = [];
    this.loading = true;
    this.productsService.getProducts().subscribe(
      (data) => {
        for (let product of data.products) {
          if (this.subcategories.some(subcategory => subcategory.id === product.subcategory_id) && !product.buyer_id && this.getRemainingTime(product) != 'Expired'){
            this.products.push(product);
          }
        }
        this.filteredProducts = [...this.products];
        this.applyFilters();
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
        this.loading = false;
      }
    );
  }

  getRemainingTime(product: any): string {
    const createdAt = new Date(product.created_at);
    const durationMs = product.duration * 60 * 60 * 1000; // Convert hours to milliseconds
    const expiryTime = new Date(createdAt.getTime() + durationMs);
    const currentTime = new Date();

    // If already expired
    if (currentTime > expiryTime) {
      return 'Expired';
    }
    else{
      return 'Not expired';
    }
  }

  filterBySubcategory() {
    this.applyFilters();
  }

  searchProducts() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearchTerm = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSubcategory = this.selectedSubcategory === null || product.subcategory_id == this.selectedSubcategory;
      return matchesSearchTerm && matchesSubcategory;
    });

    this.page = 1;
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
