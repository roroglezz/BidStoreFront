import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { UsersService } from '../../../services/users.service';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { ConditionsService } from '../../../services/conditions.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.css'
})
export class UploadProductComponent {
  subcategories: any[] = [];
  sellers: any[] = [];
  conditions: any[] = [];
  productForm = {
    name: '',
    description: '',
    base_price: 0,
    offer_price: 0,
    units: 1,
    subcategory_id: 0,
    seller_id: 0,
    condition_id: 0,
    image_url: null as File | null,
    duration: 24,
    sale_type: 'direct',
    auction_price: 0,
  };
  fileName: string = 'No file chosen';

  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
    private subcategoriesService: SubcategoriesService,
    private conditionsService: ConditionsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {

    // Cargar todas las opciones para el formulario en paralelo
    const subcategories$ = this.subcategoriesService.getSubcategories();
    const sellers$ = this.usersService.getUsers();
    const conditions$ = this.conditionsService.getCoditions();

    // Procesar subcategorías
    subcategories$.subscribe({
      next: (data) => {
        this.subcategories = data.subcategories;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.showError('Could not load subcategories');
      }
    });

    // Procesar condiciones
    conditions$.subscribe({
      next: (data) => {
        this.conditions = data.conditions;
      },
      error: (error) => {
        console.error('Error loading conditions:', error);
        this.showError('Could not load conditions');
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.productForm.image_url = event.target.files[0];
      this.fileName = event.target.files[0].name;
    } else {
      this.productForm.image_url = null;
      this.fileName = 'No file chosen';
    }
  }

  addProduct(): void {
    // Validaciones básicas
    if (!this.isFormValid()) {
      this.showError('Please fill in all required fields');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      const formData = new FormData();

      // Agregar todos los campos del formulario
      formData.append('name', this.productForm.name);
      formData.append('description', this.productForm.description);
      formData.append('base_price', this.productForm.base_price.toString());
      formData.append('offer_price', this.productForm.offer_price.toString());
      formData.append('units', this.productForm.units.toString());
      formData.append('subcategory_id', this.productForm.subcategory_id.toString());
      formData.append('seller_id', userId.toString());
      formData.append('condition_id', this.productForm.condition_id.toString());
      formData.append('duration', this.productForm.duration.toString());
      formData.append('sale_type', this.productForm.sale_type);
      formData.append('auction_price', this.productForm.auction_price.toString());

      // Agregar la imagen solo si se ha seleccionado
      if (this.productForm.image_url) {
        formData.append('image_url', this.productForm.image_url);
      }

      this.productsService.addProduct(formData).subscribe({
        next: (response) => {
          this.showSuccess('Product added successfully');
          this.resetForm();
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.showError(error.error);
        }
      });
    }


  }

  isFormValid(): boolean {
    return !!(
      this.productForm.name &&
      this.productForm.description &&
      this.productForm.base_price > 0 &&
      this.productForm.subcategory_id &&
      this.productForm.condition_id &&
      this.productForm.sale_type
    );
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      description: '',
      base_price: 0,
      offer_price: 0,
      units: 1,
      subcategory_id: 0,
      seller_id: 0,
      condition_id: 0,
      image_url: null,
      duration: 24,
      sale_type: 'direct',
      auction_price: 0,
    };
    this.fileName = 'No file chosen';
  }

  private showSuccess(message: string): void {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  private showError(error: any): void {
    let errorMessage = 'An error occurred';

    // Si el error es una cadena simple
    if (typeof error === 'string') {
      errorMessage = error;
    }
    // Si el error tiene un formato de objeto con estructura de Laravel
    else if (error && error.errors) {
      // Extraer todos los mensajes de error en un array
      let errorMessages: string[] = [];

      for (const field in error.errors) {
        if (error.errors.hasOwnProperty(field)) {
          // Añadir cada mensaje de error para este campo
          error.errors[field].forEach((msg: string) => {
            errorMessages.push(msg);
          });
        }
      }

      // Unir todos los mensajes en uno solo
      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join('<br>');
      }
    }
    // Si hay un mensaje dentro del objeto error
    else if (error && error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      title: 'Error',
      html: errorMessage, // Usar html en lugar de text para permitir formato <br>
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}