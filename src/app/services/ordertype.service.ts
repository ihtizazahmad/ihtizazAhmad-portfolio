import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdertypeService {
  apiUrl = environment.apiUrl;
  orderUrl = this.apiUrl + '/orderitem';
  selectedCard: string = '';
  receiptUrl = this.apiUrl + '/sendCourseEmail';

  constructor(private http: HttpClient) {}
  
    // Updates the currently selected card title
    updateSelectedCard(title: string): void {
      this.selectedCard = title;
    }
  
    // Creates a new order by sending orderData to the backend
    createOrder(orderData: any): Observable<any> {
      return this.http.post(this.orderUrl, orderData);
    }
  
    // Retrieves all orders from the backend
    getOrder(): Observable<any> {
      return this.http.get(this.orderUrl);
    }
  
    sendReciept(email:string, recieptContent: any):Observable<any>{
      const payload = {
        email:email,
        recieptContent:recieptContent
      }
      return this.http.post(this.receiptUrl, payload);
    }
    
    // Initiates a payment process with Stripe using a payment token
    makePayments(
      stripeToken: any,
      userId: string,
      superUserId: string
    ): Observable<any> {
      const url = `${this.apiUrl}/credit`;
      const body = { stripeToken, userId, superUserId };
      return this.http.post<any>(url, body);
    }
  
    // Creates a payment intent with Stripe
    paymentIntent(data: any): Observable<any> {
      const url = `${this.apiUrl}/paymentIntent`;
      return this.http.post<any>(url, data);
    }
  
    // Captures a payment after successful payment intent
    capturePaymentIntent(paymentIntentId: string): Observable<any> {
      const url = `${this.apiUrl}/capture_payment`;
      const body = { payment_intent_id: paymentIntentId };
      return this.http.post<any>(url, body);
    }
  
    // Creates an invoice for a payment
    createInvoice(invoiceData: any): Observable<any> {
      const url = `${this.apiUrl}/create-invoice`;
      return this.http.post<any>(url, invoiceData);
    }
  
}
