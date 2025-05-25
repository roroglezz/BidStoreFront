import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConditionsService } from '../../../services/conditions.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-conditions',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent,NgxPaginationModule],
  templateUrl: './conditions.component.html',
  styleUrl: './conditions.component.css'
})
export class ConditionsComponent {
  conditions: any[] = [];
  conditionForm = { name: '', description: ''};
  addConditionButton: boolean = false;
  conditionToEdit: any = null;  // Variable para almacenar la categoría que se está editando

  loading: boolean = false;

  page:number = 1; // Página actual
  pageSize:number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private conditionsService:ConditionsService) { }

  ngOnInit() {
    this.loadConditions();
  }

  loadConditions() {
    this.loading = true;
    this.conditionsService.getCoditions().subscribe(
      (data) => {
        this.conditions = data.conditions;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las condiciones:', error);
        this.loading = false;
      }
    );
  }

  addCondition(): void {

    this.conditionsService.addCondition(this.conditionForm).subscribe(
      (respuesta) => {
        console.log('Condición agregada:', respuesta);
        this.conditionForm = { name: '', description: ''};
        this.loadConditions();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar la condición:', error);
      }
    );
  }

  editCondition(condition: any): void {
    // Cargar la categoría para editar
    this.conditionToEdit = condition;
    this.conditionForm.name = condition.name;
    this.conditionForm.description = condition.description;
    this.addConditionButton = true; // Mostrar formulario de edición
  }


  updateCondition(): void {
    this.conditionsService.editCondition(this.conditionToEdit.id, this.conditionForm).subscribe(
      (respuesta) => {
        this.loadConditions();  // Recargar las categorías
        this.conditionForm = { name: '', description: ''};
        this.addConditionButton = false; // Ocultar formulario
        this.conditionToEdit = null;
      },
      (error) => {
        console.error('Error al actualizar la subcategoría:', error);
      }
    );
  }


  deleteCondition(id: number): void {
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
        this.conditionsService.deleteCondition(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'La condición ha sido eliminada.', 'success');
            this.loadConditions();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la condición.', 'error');
            console.error('Error al eliminar la condición:', error);
          }
        );
      }
    });
  }

  cancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.addConditionButton = false;
    this.conditionForm = { name: '', description: ''};
    this.conditionToEdit = null;
  }

  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
