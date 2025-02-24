import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import { ReservationComponent } from '../reservation/reservation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  cartQuantity: number = 0;
  constructor(private cartService: CartService, private router: Router , private dialog: MatDialog) {
    this.cartService.getCartObservable().subscribe((newCart) => {
      if (newCart.items.length > 0) {
        this.cartQuantity = newCart.totalCount;
      } else {
        this.cartQuantity = 0;
      }
    });
  }

  goToCart() {
    if (this.cartQuantity > 0) {
      this.router.navigate(['/cart']);
    } else {
      Swal.fire({
        title:
          'Your cart is currently empty. Browse our products and add your favorites!',
        icon: 'info',
        confirmButtonText: 'Browse Menu',
      }).then(() => {
        this.router.navigate(['/browse-menu/products']);
      });
    }
  }

  openReservationDialog(): void {
    this.dialog.open(ReservationComponent, {
      width: '100%',
      maxWidth: '500px',
      disableClose: true,
        panelClass: 'custom-dialog'
     
    });
  }
}
