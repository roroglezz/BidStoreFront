import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionsService } from '../../../services/auctions.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../loading/loading.component';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-auctions',
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, NgxPaginationModule],
  templateUrl: './auctions.component.html',
  styleUrl: './auctions.component.css'
})
export class AuctionsComponent {
  auctions: any[] = [];
  products: any[] = [];
  users: any[] = [];
  auctionForm = { auction_price: 0, duration: 0, selled:false, product_id: 0, buyer_id:0 };
  addAuctionButton: boolean = false;
  auctionToEdit: any = null;  // Variable para almacenar la categoría que se está editando

  loading: boolean = false;

  page: number = 1; // Página actual
  pageSize: number = 3; // Cantidad de elementos por página
  pageSizeOptions: number[] = [3, 6, 9, 12];

  constructor(private auctionsService: AuctionsService, private productsService: ProductsService, private usersService:UsersService) { }

  ngOnInit() {
    this.loadAuctions();
    this.loadProducts();
  }

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

  loadAuctions() {
    this.loading = true;
    this.auctionsService.getAuctions().subscribe(
      (data) => {
        this.auctions = data.auctions;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las subcategorías:', error);
        this.loading = false;
      }
    );
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.users;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.loading = false;
      }
    );
  }

  addAuction(): void {

    this.auctionsService.addAuction(this.auctionForm).subscribe(
      (respuesta) => {
        console.log('Subasta agregada:', respuesta);
        this.auctionForm = { auction_price: 0, duration: 0, selled:false, product_id: 0, buyer_id:0 };
        this.loadAuctions();
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar la subcategoría:', error);
      }
    );
  }

  editAuction(auction: any): void {
    // Cargar la categoría para editar
    this.auctionToEdit = auction;
    this.auctionForm.auction_price = auction.auction_price;
    this.auctionForm.duration = auction.duration;
    this.auctionForm.selled = auction.selled;
    this.auctionForm.product_id = auction.product_id;
    this.auctionForm.buyer_id = auction.buyer_id;
  }


  updateAuction(): void {
    this.auctionsService.editAuction(this.auctionToEdit.id, this.auctionForm).subscribe(
      (respuesta) => {
        this.loadAuctions();  // Recargar las subastas
        this.auctionForm = { auction_price: 0, duration: 0, selled:false, product_id: 0, buyer_id:0 };
        this.auctionToEdit = null;
      },
      (error) => {
        console.error('Error al actualizar la subasta:', error);
      }
    );
  }


  deleteAuction(id: number): void {
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
        this.auctionsService.deleteAuction(id).subscribe(
          (respuesta) => {
            Swal.fire('Eliminado', 'La subasta ha sido eliminada.', 'success');
            this.loadAuctions();
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la subasta.', 'error');
            console.error('Error al eliminar la subasta:', error);
          }
        );
      }
    });
  }

  cancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.addAuctionButton = false;
    this.auctionForm = { auction_price: 0, duration: 0, selled:false, product_id: 0, buyer_id:0 };
    this.auctionToEdit = null;
  }
  
  changePageSize(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
  }
}
