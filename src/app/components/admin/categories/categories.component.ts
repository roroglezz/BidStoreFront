import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule,RouterLink,LoadingComponent,NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: any[] = [];
  categoryForm = { name: '', description: '', image_url: null as File | null, _method: 'PUT' };
  addCategoryButton: boolean = false;
  categoryToEdit: any = null;  // Variable para almacenar la categoría que se está editando

  loading: boolean = false;
  fileName: string = '';

  page:number = 1; // Página actual
  pageSize:number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoriesService.getCategories().subscribe(
      (data) => {
        this.categories = data.categories;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
        this.loading = false;
      }
    );
  }

  addCategory(): void {
    const formData = new FormData();
    formData.append('name', this.categoryForm.name);
    formData.append('description', this.categoryForm.description);

    if (this.categoryForm.image_url) {
      formData.append('image_url', this.categoryForm.image_url);
    }

    this.categoriesService.addCategory(formData).subscribe(
      (respuesta) => {
        console.log('Categoría agregada:', respuesta);
        this.loadCategories();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar la categoría:', error);
      }
    );
  }

  editCategory(category: any): void {
    // Cargar la categoría para editar
    this.categoryToEdit = category;
    this.categoryForm.name = category.name;
    this.categoryForm.description = category.description;
    this.categoryForm.image_url = null; // No necesitas poner la imagen en la categoría editada (si no la modificas)
    this.addCategoryButton = true; // Mostrar formulario de edición
  }


  updateCategory(): void {
    const formData = new FormData();
    formData.append('name', this.categoryForm.name);
    formData.append('description', this.categoryForm.description);
    formData.append('_method', 'PUT');

    // Solo agregar la imagen si se ha seleccionado una nueva imagen
    if (this.categoryForm.image_url) {
      formData.append('image_url', this.categoryForm.image_url);
    }

    console.log('Category form data:', this.categoryForm);

    // Enviar la solicitud de actualización al backend
    this.categoriesService.editCategory(this.categoryToEdit.id, formData).subscribe(
      (respuesta) => {
        console.log('Categoría actualizada:', respuesta);
        this.loadCategories();  // Recargar las categorías
        this.categoryForm = { name: '', description: '', image_url: null as File | null, _method: 'PUT'  };
        this.addCategoryButton = false; // Ocultar formulario
        this.categoryToEdit = null;  // Limpiar la categoría editada
      },
      (error) => {
        console.error('Error al actualizar la categoría:', error);
      }
    );
  }


  deleteCategory(id: number): void {
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
        this.categoriesService.deleteCategory(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
            this.loadCategories();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
            console.error('Error al eliminar la categoría:', error);
          }
        );
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.categoryForm.image_url = file;
    }
  }

  cancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.addCategoryButton = false;
    this.categoryForm = { name: '', description: '', image_url: null, _method: 'PUT'  };
    this.categoryToEdit = null;
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
