import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { CategoriesService } from '../../../services/categories.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-subcategories',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent,NgxPaginationModule],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css'
})
export class SubcategoriesComponent {
  subcategories: any[] = [];
  categories: any[] = [];
  subcategoryForm = { name: '', description: '', category_id: 0};
  addSubcategoryButton: boolean = false;
  subcategoryToEdit: any = null;  // Variable para almacenar la categoría que se está editando

  loading: boolean = false;

  page:number = 1; // Página actual
  pageSize:number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private subcategoresService: SubcategoriesService, private categoriesService:CategoriesService) { }

  ngOnInit() {
    this.loadSubcategories();
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

  loadSubcategories() {
    this.loading = true;
    this.subcategoresService.getSubcategories().subscribe(
      (data) => {
        this.subcategories = data.subcategories;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las subcategorías:', error);
        this.loading = false;
      }
    );
  }

  addSubcategory(): void {

    this.subcategoresService.addSubcategory(this.subcategoryForm).subscribe(
      (respuesta) => {
        console.log('Subcategoría agregada:', respuesta);
        this.subcategoryForm = { name: '', description: '', category_id: 0};
        this.loadSubcategories();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar la subcategoría:', error);
      }
    );
  }

  editSubcategory(subcategory: any): void {
    // Cargar la categoría para editar
    this.subcategoryToEdit = subcategory;
    this.subcategoryForm.name = subcategory.name;
    this.subcategoryForm.description = subcategory.description;
    this.subcategoryForm.category_id = subcategory.category_id;
    this.addSubcategoryButton = true; // Mostrar formulario de edición
  }


  updateSubcategory(): void {
    this.subcategoresService.editSubcategory(this.subcategoryToEdit.id, this.subcategoryForm).subscribe(
      (respuesta) => {
        this.loadSubcategories();  // Recargar las categorías
        this.subcategoryForm = { name: '', description: '', category_id: 0};
        this.addSubcategoryButton = false; // Ocultar formulario
        this.subcategoryToEdit = null;
      },
      (error) => {
        console.error('Error al actualizar la subcategoría:', error);
      }
    );
  }


  deleteSubcategory(id: number): void {
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
        this.subcategoresService.deleteSubcategory(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'La subcategoría ha sido eliminada.', 'success');
            this.loadSubcategories();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la subcategoría.', 'error');
            console.error('Error al eliminar la subcategoría:', error);
          }
        );
      }
    });
  }

  cancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.addSubcategoryButton = false;
    this.subcategoryForm = { name: '', description: '', category_id: 0};
    this.subcategoryToEdit = null;
  }
  
  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
