import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  categoryForm = {name: '', description: '', image_url: null as File | null};

  constructor(private categoriesService:CategoriesService){}

  addCategory() {
    const formData = new FormData();
    formData.append('name', this.categoryForm.name);
    formData.append('description', this.categoryForm.description);
    if (this.categoryForm.image_url) {
      formData.append('image_url', this.categoryForm.image_url);
    }
  
    // Depuración: Imprime el contenido de FormData
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    this.categoriesService.addCategory(formData).subscribe(
      (response) => {
        console.log(response);
        this.resetForm();
      },
      (error) => {
        console.error('Error:', error);
      }
    );


  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) { // Asegúrate de que sea una imagen
        this.categoryForm.image_url = file;
      } else {
        console.error('El archivo seleccionado no es una imagen válida.');
      }
    }
  }

  resetForm() {
    this.categoryForm = { name: '', description: '', image_url: null };
  
    // Opcional: Limpia el campo de archivo en el DOM
    const fileInput = document.getElementById('image_url') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

}
