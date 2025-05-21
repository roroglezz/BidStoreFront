import { Component} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class AdminComponent{
  numUsers: number = 0;
  numProducts: number = 0;

  ngOnInit() {
    this.countUsers();
    this.countProducts();

  }

  constructor(
    private usersService: UsersService,
    private productsService: ProductsService
  ) {}

  countUsers() {
    this.usersService.getUsers().subscribe((response) => {
      this.numUsers = response.users.length;
    });
  }

  countProducts() {
    this.productsService.getProducts().subscribe((response) => {
      this.numProducts = response.products.length;
    });
  }
}
