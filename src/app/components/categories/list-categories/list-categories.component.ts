import { Component } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-list-categories',
  imports: [CommonModule,RouterLink,LoadingComponent],
  templateUrl: './list-categories.component.html',
  styleUrl: './list-categories.component.css'
})
export class ListCategoriesComponent {
  categories:any[] = [];
  loading:boolean = false;
  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories():any {
    this.loading = true;
    this.categoriesService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categories;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
