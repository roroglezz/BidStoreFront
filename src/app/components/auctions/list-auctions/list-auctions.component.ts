import { Component, OnInit,Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuctionsService } from '../../../services/auctions.service';
import { SubcategoriesService } from '../../../services/subcategories.service';
import { LoadingComponent } from '../../loading/loading.component';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent],
  templateUrl: './list-auctions.component.html',
  styleUrl: './list-auctions.component.css'
})
export class ListAuctionsComponent implements OnInit {
  // Data
  auctions: any[] = [];
  filteredAuctions: any[] = [];
  subcategories: any[] = [];
  loading: boolean = true;

  // Filters
  searchQuery: string = '';
  sortOption: string = 'end-soon';
  subcategoryFilter: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  isDarkMode: boolean = false;

  private checkAuctionsInterval: Subscription | null = null;

  constructor(
    private auctionsService: AuctionsService,
    private subcategoriesService: SubcategoriesService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.loadData();

    this.checkAuctionsInterval = interval(60000).subscribe(() => {
      this.checkExpiredAuctions();
    });

    this.checkExpiredAuctions();
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.checkAuctionsInterval) {
      this.checkAuctionsInterval.unsubscribe();
    }
  }

  checkExpiredAuctions() {
    this.auctionsService.checkExpiredAuctions().subscribe({
      next: (response) => {
        if (response.closed_auctions && response.closed_auctions.length > 0) {
          console.log(`${response.closed_auctions.length} subastas cerradas automáticamente`);
          this.loadData(); // Recargar los datos si se cerraron subastas
        }
      },
      error: (error) => {
        console.log('Error al verificar subastas expiradas:', error);
      }
    });
  }

  loadData() {
    this.loading = true;

    // Load subcategories and auctions in parallel
    const subcategories$ = this.subcategoriesService.getSubcategories();
    const auctions$ = this.auctionsService.getAuctions();

    // Process subcategories
    subcategories$.subscribe({
      next: (data) => {
        this.subcategories = data.subcategories;
      },
      error: (error) => {
        console.error('Error loading subcategories:', error);
        this.showError('Could not load subcategories');
      }
    });

    // Process auctions
    auctions$.subscribe({
      next: (data) => {
        this.auctions = data.auctions;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading auctions:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    // Start with all auctions
    let filtered = [...this.auctions];

    // Apply search filter
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(auction =>
        auction.product.name.toLowerCase().includes(query) ||
        auction.product.description.toLowerCase().includes(query)
      );
    }

    // Apply subcategory filter
    if (this.subcategoryFilter) {
      filtered = filtered.filter(auction =>
        auction.product.subcategory_id.toString() === this.subcategoryFilter.toString()
      );
    }

    // Apply sorting
    filtered = this.sortAuctions(filtered, this.sortOption);

    // Update filtered auctions and pagination
    this.filteredAuctions = filtered;
    this.totalPages = Math.ceil(this.filteredAuctions.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  sortAuctions(auctions: any[], sortBy: string): any[] {
    switch (sortBy) {
      case 'end-soon':
        return [...auctions].sort((a, b) => {
          const aRemaining = this.getTimeRemainingMs(a.created_at, a.duration);
          const bRemaining = this.getTimeRemainingMs(b.created_at, b.duration);
          return aRemaining - bRemaining;
        });
      case 'newest':
        return [...auctions].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'price-asc':
        return [...auctions].sort((a, b) =>
          parseFloat(a.auction_price) - parseFloat(b.auction_price)
        );
      case 'price-desc':
        return [...auctions].sort((a, b) =>
          parseFloat(b.auction_price) - parseFloat(a.auction_price)
        );
      default:
        return auctions;
    }
  }

  // Pagination methods
  get paginatedAuctions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAuctions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageArray(): number[] {
    // Show max 5 page buttons
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    return Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);
  }

  // Utility methods for displaying auctions
  calculateTimeRemaining(createdAt: string, durationHours: number): string {
    const msRemaining = this.getTimeRemainingMs(createdAt, durationHours);

    if (msRemaining <= 0) {
      return 'Ended';
    }

    // Convert to days, hours, minutes
    const days = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  }

  getTimeRemainingMs(createdAt: string, durationHours: number): number {
    const created = new Date(createdAt).getTime();
    const ends = created + (durationHours * 60 * 60 * 1000);
    return ends - Date.now();
  }

  getTimeRemainingClass(auction: any): string {
    const msRemaining = this.getTimeRemainingMs(auction.created_at, auction.duration);

    if (msRemaining <= 0) {
      return 'bg-gray-100 text-gray-800'; // Ended
    } else if (msRemaining < 3600000) { // Less than 1 hour
      return 'bg-red-100 text-red-800 animate-pulse'; // Urgent
    } else if (msRemaining < 86400000) { // Less than 24 hours
      return 'bg-orange-100 text-orange-800'; // Soon
    } else {
      return 'bg-green-100 text-green-800'; // Plenty of time
    }
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  isAuctionExpired(auction: any): boolean {
    return this.getTimeRemainingMs(auction.created_at, auction.duration) <= 0 || auction.selled === true;
  }

  checkDarkMode() {
    // Por defecto asumimos que no está en modo oscuro
    this.isDarkMode = false;
    
    // Comprobamos si el usuario tiene preferencia por modo oscuro en su sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Comprobamos si el tema de la aplicación está en modo oscuro
    const bodyHasDarkClass = this.document.body.classList.contains('dark-theme') || 
                            this.document.body.classList.contains('vs-dark');
    const htmlHasDarkClass = this.document.documentElement.classList.contains('dark-theme') || 
                            this.document.documentElement.classList.contains('vs-dark');
    
    // Consideramos que está en modo oscuro si cualquiera de estas condiciones es verdadera
    this.isDarkMode = bodyHasDarkClass || htmlHasDarkClass || prefersDark;
    
    console.log('Modo oscuro detectado:', this.isDarkMode);
  }

  placeBid(auction: any) {
    if (this.isAuctionExpired(auction)) {
      this.showError('This auction has ended. You can no longer place bids.');
      return;
    }

    // Verificamos el modo oscuro antes de mostrar el diálogo
    this.checkDarkMode();
    
    const currentBid = parseFloat(auction.auction_price);
    const minimumBid = currentBid * 1.05; // 5% higher than current bid

    // Configuración condicional para el tema del modal
    const swalOptions: any = {
      title: 'Place a bid',
      html: `
        <p>Current bid: €${currentBid.toFixed(2)}</p>
        <p class="text-sm ${this.isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-4">Minimum bid: €${minimumBid.toFixed(2)}</p>
      `,
      input: 'number',
      inputAttributes: {
        min: minimumBid.toFixed(2),
        step: '0.01'
      },
      inputValue: minimumBid.toFixed(2),
      showCancelButton: true,
      confirmButtonText: 'Place Bid',
      showLoaderOnConfirm: true,
      preConfirm: function(bid: any): any {
        const bidValue = parseFloat(bid);
        if (bidValue < minimumBid) {
          Swal.showValidationMessage(`Bid must be at least €${minimumBid.toFixed(2)}`);
          return false;
        }
        return bid;
      }
    };
    
    // Solo aplicamos estilos de modo oscuro si realmente estamos en modo oscuro
    if (this.isDarkMode) {
      swalOptions.customClass = {
        popup: 'swal2-dark',
        input: 'swal2-input-dark',
        confirmButton: 'swal2-confirm-dark',
        cancelButton: 'swal2-cancel-dark'
      };
      swalOptions.background = '#fffff';
      swalOptions.color = '#000000';
    }

    Swal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          this.showError('You must be logged in to place a bid');
          return;
        }

        const bidData = {
          auction_price: parseFloat(result.value),
          buyer_id: userId
        };

        this.auctionsService.makeBid(auction.id, bidData).subscribe(
          response => {
            console.log('Bid placed successfully:', response);
            this.loadData();
            
            // Configuración condicional para el mensaje de confirmación
            const confirmOptions: any = {
              title: 'Bid Placed!',
              text: `Your bid of €${result.value} has been placed.`,
              icon: 'success'
            };
            
            // Solo aplicamos estilos de modo oscuro si realmente estamos en modo oscuro
            if (this.isDarkMode) {
              confirmOptions.customClass = {
                popup: 'swal2-dark',
                confirmButton: 'swal2-confirm-dark'
              };
              confirmOptions.background = '#000000';
              confirmOptions.color = '#ffffff';
            }
            
            Swal.fire(confirmOptions);
          },
          error => {
            console.error('Error placing bid:', error);
            this.showError(error.error.message || 'Could not place bid');
          }
        );
      }
    });
  }

  showError(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}