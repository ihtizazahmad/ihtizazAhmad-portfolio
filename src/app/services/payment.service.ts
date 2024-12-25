import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { PaymentList } from '../components/interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {



  constructor(private http: HttpClient,) {
  }
  apiUrl = environment.apiUrl
  // get PaymentList
  getPaymentList(): Observable<PaymentList[]> {
    return this.http.get<PaymentList[]>(`${this.apiUrl}/payment`)
  }
}
