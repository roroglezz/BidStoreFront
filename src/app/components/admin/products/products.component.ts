import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { UsersService } from '../../../services/users.service';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { ConditionsService } from '../../../services/conditions.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: any[] = [];
  subcategories: any[] = [];
  sellers: any[] = [];
  conditions: any[] = [];
  productForm = {
    name: '',
    description: '',
    base_price: 0,
    offer_price: 0,
    units: 0,
    subcategory_id: 0,
    seller_id: 0,
    condition_id: 0,
    image_url: null as File | null,
    duration: 0,
    sale_type: 'direct',
    auction_price: 0,
    _method: ''
  };
  addProductButton: boolean = false;
  productToEdit: any = null;  // Variable para almacenar el producto que se está editando

  loading: boolean = false;

  fileName: string = '';

  page: number = 1;
  pageSize: number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 25, 50, 100];

  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
    private subcategoriesService: SubcategoriesService,
    private conditionsService: ConditionsService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadSubcategories();
    this.loadSellers();
    this.loadConditions();
  }

  ngAfterViewInit() {
    // Add event listener to file input to show selected filename
    document.querySelector('.file-input')?.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      const fileNameElement = document.querySelector('.file-name');

      if (fileNameElement && input && input.files && input.files.length > 0) {
        fileNameElement.textContent = input.files[0].name;
      } else if (fileNameElement) {
        fileNameElement.textContent = 'No file chosen';
      }
    });
  }

  loadSubcategories() {
    this.loading = true;
    this.subcategoriesService.getSubcategories().subscribe(
      (data) => {
        this.subcategories = data.subcategories;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.loading = false;
      }
    );
  }

  loadSellers() {
    this.loading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.sellers = data.users;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.loading = false;
      }
    );
  }

  loadConditions() {
    this.loading = true;
    this.conditionsService.getCoditions().subscribe(
      (data) => {
        this.conditions = data.conditions;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
        this.loading = false;
      }
    );
  }

  // Cargar productos desde el backend
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

  // Agregar un producto
  addProduct(): void {
    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('base_price', this.productForm.base_price.toString());
    formData.append('offer_price', this.productForm.offer_price.toString());
    formData.append('units', this.productForm.units.toString());
    formData.append('subcategory_id', this.productForm.subcategory_id.toString());
    formData.append('seller_id', this.productForm.seller_id.toString());
    formData.append('condition_id', this.productForm.condition_id.toString());
    formData.append('duration', this.productForm.duration.toString());
    formData.append('sale_type', this.productForm.sale_type);
    
    if (this.productForm.sale_type === 'auction' || this.productForm.sale_type === 'both') {
      formData.append('auction_price', this.productForm.auction_price.toString());
    }

    // Agregar la imagen solo si se ha seleccionado
    if (this.productForm.image_url) {
      formData.append('image_url', this.productForm.image_url);
    }

    this.productsService.addProduct(formData).subscribe(
      (respuesta) => {
        console.log('Producto agregado:', respuesta);
        this.loadProducts();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar el producto:', error);
      }
    );

  }

  // Editar un producto
  editProduct(product: any): void {
    // Cargar el producto para editar
    this.productToEdit = product;
    this.productForm.name = product.name;
    this.productForm.description = product.description;
    this.productForm.base_price = product.base_price;
    this.productForm.offer_price = product.offer_price;
    this.productForm.units = product.units;
    this.productForm.subcategory_id = product.subcategory_id;
    this.productForm.seller_id = product.seller_id;
    this.productForm.condition_id = product.condition_id;
    this.productForm.duration = product.duration;
    this.productForm.image_url = null; // No necesitas poner la imagen en el producto editado si no la modificas
    this.productForm.sale_type = product.sale_type || 'direct';
    this.productForm.auction_price = product.auction_price || 0;
    this.addProductButton = true; // Mostrar formulario de edición
  }

  // Actualizar un producto
  updateProduct(): void {
    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('base_price', this.productForm.base_price.toString());
    formData.append('offer_price', this.productForm.offer_price.toString());
    formData.append('units', this.productForm.units.toString());
    formData.append('subcategory_id', this.productForm.subcategory_id.toString());
    formData.append('seller_id', this.productForm.seller_id.toString());
    formData.append('condition_id', this.productForm.condition_id.toString());
    formData.append('duration', this.productForm.duration.toString());
    formData.append('sale_type', this.productForm.sale_type);
    
    if (this.productForm.sale_type === 'auction' || this.productForm.sale_type === 'both') {
      formData.append('auction_price', this.productForm.auction_price.toString());
    }
    
    formData.append('_method', 'PUT'); // Método para actualizar el producto

    // Solo agregar la imagen si se ha seleccionado una nueva imagen
    if (this.productForm.image_url) {
      formData.append('image_url', this.productForm.image_url);
    }

    console.log('Producto form data:', this.productForm);

    // Enviar la solicitud de actualización al backend
    this.productsService.editProduct(this.productToEdit.id, formData).subscribe(
      (respuesta) => {
        console.log('Producto actualizado:', respuesta);
        this.loadProducts();  // Recargar los productos
        this.productForm = {
          name: '',
          description: '',
          base_price: 0,
          offer_price: 0,
          units: 0,
          subcategory_id: 0,
          seller_id: 0,
          condition_id: 0,
          image_url: null,
          duration: 0,
          sale_type: 'direct',
          auction_price: 0,
          _method: ''
        };
        this.addProductButton = false; // Ocultar formulario
        this.productToEdit = null;  // Limpiar el producto editado
      },
      (error) => {
        console.log('Error al actualizar el producto:', error);
      }
    );
  }

  // Eliminar un producto
  deleteProduct(id: number): void {
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
        this.productsService.deleteProduct(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.loadProducts();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            console.error('Error al eliminar el producto:', error);
          }
        );
      }
    });
  }

  // Manejar la selección de archivo para la imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      // Procesa el archivo para enviarlo al servidor
      this.productForm.image_url = file; 

      // También puedes leer el archivo para previsualizarlo si quieres
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Si quieres mostrar una vista previa
        // this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Cancelar el formulario de producto
  cancelForm(): void {
    this.resetForm();
  }

  // Resetear el formulario
  resetForm(): void {
    this.addProductButton = false;  // Close form if it's open
    this.productForm = {
      name: '',
      description: '',
      base_price: 0,
      offer_price: 0,
      units: 0,
      subcategory_id: 0,
      seller_id: 0,
      condition_id: 0,
      image_url: null,
      duration: 0,
      sale_type: 'direct',
      auction_price: 0,
      _method: ''
    };
    this.productToEdit = null;  // Ensure no data is carried over from editing
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
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

    // Calculate remaining time
    const remainingMs = expiryTime.getTime() - currentTime.getTime();
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

    // Format the output
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  isFormValid(): boolean {
    // Para productos nuevos, la imagen es requerida
    if (!this.productToEdit && !this.productForm.image_url) {
      console.log('Image is required for new products');
      return false;
    }
    
    // Verificar los otros campos
    if (!this.productForm.name ||
        !this.productForm.description ||
        !this.productForm.base_price ||
        !this.productForm.offer_price ||
        !this.productForm.units ||
        !this.productForm.subcategory_id ||
        !this.productForm.seller_id ||
        !this.productForm.condition_id ||
        !this.productForm.sale_type ||
        !this.productForm.duration ||
        ((this.productForm.sale_type === 'auction' || this.productForm.sale_type === 'both') && !this.productForm.auction_price)) {
      console.log('Missing required fields');
      return false;
    }
    
    return true;
  }
}
