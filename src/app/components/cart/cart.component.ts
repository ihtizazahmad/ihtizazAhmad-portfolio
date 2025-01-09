import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { cart } from '../interfaces/cart';
import { cartItem } from '../interfaces/cartitem';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/services/tax.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
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
  taxId: any
  taxvalue: any;
  taxName: any;
  addtax: any;
  defaultTax: any[] = [];

  constructor(private cartService : CartService, private router : Router, private taxService : TaxService){}

  ngOnInit(): void {
    this.cartService.getCartObservable().subscribe((cart) => {

      this.cart = cart;
      console.log("cart items :", this.cart)
      this.totalCount = this.cart?.totalCount;
      this.totalPrice = this.cart?.totalPrice;
      this.subtotal = this.cart?.totalPrice
      this.calculateTotalModifierPrice();
      this.gettax();
    });
  }

  removeProduct(cartItem: cartItem, index: number) {
    this.cartService.removeFromCart(cartItem.food._id, index);
    this.calculateTotalModifierPrice();
  }
  calculateTotalModifierPrice() {
    this.modifierPrice = 0;
    this.cart.items.forEach((cartItem) => {
      cartItem.food.modifiers?.forEach((modifier: any) => {
        modifier.subcategories?.forEach((subcategory: any) => {
          this.modifierPrice += subcategory.total || 0;
        });
      });
    });
    this.cart.modifierPrice = this.modifierPrice;
  }
  increment(cartItem: cartItem, quantity: number, index: number): void {
    this.cartService.changeQuantity(cartItem.food._id, quantity, index);
    this.calculateTotalModifierPrice();
    this.gettax();
  }
  
  decrement(cartItem: cartItem, quantity: number, index: number): void {
    if (quantity >= 1) {
      this.cartService.changeQuantity(cartItem.food._id, quantity - 1, index);
      this.calculateTotalModifierPrice();
      this.gettax();
    }
  }
//   gettax() {
//     this.taxService.getTax().subscribe((res: any) => {
//       const tax = res.filter((item: any) => {
//         if (item?.userId === this.businessId) {
//           return item;
//         }

//       });
//       console.log(":", tax)
//       // Convert `taxName` into an array if it's not one already
// this.taxName = Array.isArray(tax) ? tax : [tax]; 

//       const taxValues = tax.map((item: any) =>
//         Number(item.taxValue)
//       )
//       let sumOfTaxes = taxValues.reduce((acc: any, curr: any) => acc + curr, 0);
//       console.log("::::", sumOfTaxes)
//       this.addtax = ((this.subtotal * sumOfTaxes) / 100)
//       this.totalPrice += this.addtax;

//       for (let i = 0; i < this.taxName.length; i++) {
//         let singleTaxValue = this.taxName[i].taxValue;
//         let addtax = (this.subtotal * singleTaxValue) / 100;

//         let existingTaxIndex = this.defaultTax.findIndex((tax: any) => tax.name === this.taxName[i].name);
//         if (existingTaxIndex !== -1) {
//           this.defaultTax[existingTaxIndex].addtax = addtax;
//         } else {

//           let taxResult = {
//             name: this.taxName[i].name,
//             addtax: addtax
//           };
//           this.defaultTax.push(taxResult);
//         }
//       }

//     })

//   }

gettax() {
  this.taxService.getTax().subscribe((res: any) => {
    // Filter tax items for the current businessId
    const applicableTaxes = res.filter((item: any) => item?.userId === this.businessId);
    
    console.log("Filtered applicable taxes:", applicableTaxes);

    // Initialize the total tax amount
    let totalTaxPercentage = applicableTaxes.reduce((sum: number, tax: any) => sum + Number(tax.taxValue), 0);
    
    // Calculate total tax to be added to subtotal
    this.addtax = (this.subtotal * totalTaxPercentage) / 100;
    this.totalPrice = this.subtotal + this.addtax; // Add tax to total price

    // Update or add individual tax items
    this.defaultTax = []; // Reset defaultTax before adding new values
    applicableTaxes.forEach((tax: any) => {
      const taxValue = Number(tax.taxValue);
      const taxAmount = (this.subtotal * taxValue) / 100;
      this.defaultTax.push({
        name: tax.name,
        addtax: taxAmount
      });
    });

    console.log("Total tax amount:", this.addtax);
    console.log("Updated total price:", this.totalPrice);
    console.log("Default tax details:", this.defaultTax);
  });
}

  
  goToCheckout() {
    const cartJson = JSON.stringify({
      items: this.cart.items,
      tax: this.defaultTax,
      taxvalue: this.addtax,
      modifierPrice: this.modifierPrice,
      totalPrice: this.totalPrice
    });
    localStorage.setItem('Cart', cartJson);
    this.router.navigate(['/checkout']);
  }
}
