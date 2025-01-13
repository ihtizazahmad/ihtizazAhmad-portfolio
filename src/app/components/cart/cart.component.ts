import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { cart } from '../interfaces/cart';
import { cartItem } from '../interfaces/cartitem';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/services/tax.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart!: cart;
  modifierPrice: any = 0;
  modifiers: any;
  totalCount: any;
  totalPrice!: any;
  subtotal: number = 0;
  businessId = '674ba2d30e062b07414d6704';

  // //  for test mode-->
  // businessId = '65d6e2acf4cb2c368afded71';
  

  constructor(
    private cartService: CartService,
    private router: Router,
    private taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      console.log('cart items :', this.cart);
      this.totalCount = this.cart?.totalCount;
      this.totalPrice = this.cart?.totalPrice;
      this.subtotal = this.cart?.totalPrice;
      this.calculateTotalModifierPrice();
    });
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/no-photo.png';
  }

  removeProduct(cartItem: cartItem, index: number) {
    this.cartService.removeFromCart(cartItem.food._id, index);
    this.calculateTotalModifierPrice();
  }
  calculateTotalModifierPrice() {
    this.modifierPrice = 0;
    if (this.cart.items.length > 0) {
      this.cart.items.forEach((cartItem) => {
        cartItem.food.modifiers?.forEach((modifier: any) => {
          modifier.subcategories?.forEach((subcategory: any) => {
            if (subcategory && cartItem) {
              this.modifierPrice += subcategory.total || 0;
            }
          });
        });
      });
    }
    this.cart.modifierPrice = this.modifierPrice;
  }
  increment(cartItem: cartItem, quantity: number, index: number): void {
    this.cartService.changeQuantity(cartItem.food._id, quantity, index);
    this.calculateTotalModifierPrice();
  }
  decrement(cartItem: cartItem, quantity: number, index: number): void {
    if (quantity > 1) {
      const newQuantity = quantity - 1; 
      this.cartService.changeQuantity(cartItem.food._id, newQuantity, index); 
      this.calculateTotalModifierPrice();
    } else if (quantity === 1) {
      console.warn('Quantity cannot go below 1');
    }
  }

  goToCheckout() {
    const cartJson = JSON.stringify({
      items: this.cart.items,
      modifierPrice: this.modifierPrice,
      totalPrice: this.totalPrice,
    });
    localStorage.setItem('Cart', cartJson);
    this.router.navigate(['/checkout']);
  }
}
