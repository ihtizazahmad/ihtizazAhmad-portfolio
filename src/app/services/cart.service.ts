import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { cart } from '../components/interfaces/cart';
import { cartItem } from '../components/interfaces/cartitem';
import { Product } from '../components/interfaces/product';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private checkoutData: any = null;
  private cartItemsChangedSubject: BehaviorSubject<void> =
    new BehaviorSubject<any>(null);
  private cart: cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<cart> = new BehaviorSubject(this.cart);
  cartItemsChanged = this.cartItemsChangedSubject.asObservable();
  constructor(private router: Router) {}

  addToCart(food: Product): void {
    console.log('Attempting to add product:', food);
    console.log('Current cart:', this.cart);

    let cartItemIndex = this.cart.items.findIndex((item, index) => {
      if (item.food._id !== food._id) return false;
      if (
        !item.food.modifiers ||
        !food.modifiers ||
        item.food.modifiers.length !== food.modifiers.length
      ) {
        return false;
      }

      return item.food.modifiers.every((modifier: any, index: number) => {
        const foodModifier = food.modifiers[index];

        if (modifier._id !== foodModifier._id) return false;

        const cartSubcategories = modifier.subcategories || [];
        const foodSubcategories = foodModifier.subcategories || [];

        if (cartSubcategories.length !== foodSubcategories.length) {
          return false;
        }

        const subcategoryMatch = cartSubcategories.map(
          (subcategory: any, subIndex: number) =>
            subcategory._id === foodSubcategories[subIndex]._id
        );

        return subcategoryMatch.every((match: any) => match);
      });
    });

    if (cartItemIndex !== -1) {
      console.log('Product ID matched. Increasing quantity...');
      this.cart.items[cartItemIndex].quantity += 1;
      this.setCartToLocalStorage();
      this.changeQuantity(
        food._id,
        this.cart.items[cartItemIndex].quantity,
        cartItemIndex
      );
      Swal.fire({
        title: 'Item Already in Cart',
        text: `${food.name} quantity has been updated in your cart.`,
        icon: 'info',
        confirmButtonText: 'Continue Shopping',
        showCancelButton: true,
        cancelButtonText: 'Go to Cart',
        background: '#f7f7f7',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        iconColor: '#28a745',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/browse-menu/products');
        } else if (result.isDismissed) {
          this.router.navigateByUrl('/cart');
        }
      });
      return;
    }

    console.log('Product not fully matched in cart. Adding as new item...');
    this.cart.items.push(new cartItem(food));
    this.setCartToLocalStorage();

    Swal.fire({
      title: 'Product Added to Cart!',
      text: `${food.name} has been added to your cart.`,
      icon: 'success',
      confirmButtonText: 'Continue Shopping',
      showCancelButton: true,
      cancelButtonText: 'Go to Cart',
      background: '#f7f7f7',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      iconColor: '#28a745',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/browse-menu/products');
      } else if (result.isDismissed) {
        this.router.navigateByUrl('/cart');
      }
    });
  }
  

  increaseProductQuantity(item: any, quantity: number) {
    const index = this.cartItems.findIndex((cartItem) => cartItem === item);
    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
      this.cartItemsChangedSubject.next();
    }
  }

  productExists(item: any): boolean {
    return this.cartItems.some(
      (cartItem) => cartItem.ProductId === item.ProductId
    );
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(foodId: string, index: number): void {
    this.cart.items.splice(index, 1);
    this.setCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  setCheckoutData(data: any) {
    this.checkoutData = data;
  }

  getCheckoutData() {
    return this.checkoutData;
  }

  getCartObservable(): Observable<cart> {
    return this.cartSubject.asObservable();
  }
  changeQuantity(foodId: string, quantity: number, index: number) {
    const cartItem = this.cart.items[index];
    if (!cartItem) return;
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;

    if (cartItem.food.modifiers) {
      cartItem.food.modifiers.forEach((modifier: any) => {
        modifier.subcategories.forEach((subcategory: any) => {
          subcategory.total = quantity * subcategory.price;
        });
      });
    }
    this.setCartToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  getCartFromLocalStorage(): cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new cart();
  }

  clearCart() {
    this.cart = new cart();
    localStorage.removeItem('Cart');
    localStorage.clear()
    this.cartSubject.next(this.cart);
  }
}
