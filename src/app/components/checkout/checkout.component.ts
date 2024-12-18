import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  formData = {
    fullName: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  onSubmit() {
    console.log('Form Submitted', this.formData);
    alert('Checkout Completed Successfully!');
  }
}
