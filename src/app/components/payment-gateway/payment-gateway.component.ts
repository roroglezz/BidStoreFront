import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-gateway',
  imports: [CommonModule,FormsModule,LoadingComponent],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
  amount: number = 0;
  isLoading: boolean = false; // Variable para controlar el estado de carga
  constructor(private transactionsService: TransactionsService, private router:Router) { }

  addBalance() {
    this.isLoading = true;  // Activar el componente de carga
    const userId = parseInt(localStorage.getItem('userId') || '', 10);
    if(userId){
      this.transactionsService.makeTransaction(userId, this.amount).subscribe(
        response => {
          console.log('Balance added successfully:', response);
          setTimeout(() => {
            this.isLoading = false;  
            this.router.navigate(['/profile']); // Redirigir a la página de perfil
          }, 3000);
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El saldo se ha añadido correctamente',
            confirmButtonText: 'Aceptar'
          });
        },
        error => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            confirmButtonText: 'Aceptar'
          });
          console.log('Error adding balance:', error);
        }
      );
    }
  }
}
