import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private checkoutData: any = null;
  private cartItemsChangedSubject: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  cartItemsChanged = this.cartItemsChangedSubject.asObservable();



  addProduct(item: any) {
    this.cartItems.push(item);
    this.cartItemsChangedSubject.next();
  }


  increaseProductQuantity(item: any, quantity: number) {
    const index = this.cartItems.findIndex(cartItem => cartItem === item);
    if (index !== -1) {
      this.cartItems[index].quantity += quantity;
      this.cartItemsChangedSubject.next();
    }
  }

  productExists(item: any): boolean {   
    return this.cartItems.some(cartItem => cartItem.ProductId === item.ProductId);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }
 
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  

  removeProduct(item: any): void {
    const index = this.cartItems.findIndex(cartItem => cartItem === item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartItemsChangedSubject.next();  // Notify subscribers that cart items have changed
    }
  }

  setCheckoutData(data: any) {
    this.checkoutData = data;
  }

  getCheckoutData() {
    return this.checkoutData;
  }


}
