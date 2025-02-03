import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  cartQuantity: number = 0;
  constructor(private cartService: CartService, private router: Router) {
    this.cartService.getCartObservable().subscribe((newCart) => {
      console.log("first", newCart)
      if (newCart.items.length > 0) {
        this.cartQuantity = newCart.totalCount;
      }else {
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
}
