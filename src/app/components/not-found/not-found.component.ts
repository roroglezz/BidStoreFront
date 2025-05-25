import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(
    private location: Location,
    private router: Router
  ) { }

  goBack(): void {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // If there's no history, go to home
      this.router.navigate(['/home']);
    }
  }
}
