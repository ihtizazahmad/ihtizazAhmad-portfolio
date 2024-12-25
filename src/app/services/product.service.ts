import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable,of, tap,} from 'rxjs';
import { Product } from '../components/interfaces/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private checkoutData: any = [];
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();
  public apiUrl = environment.apiUrl
  productUrl = this.apiUrl +  '/Product'
  reviewUrl = this.apiUrl + '/review'
  getdeviceUrl = this.apiUrl + '/device'
  constructor(private http:HttpClient,) { }

  
  getProducts():Observable<Product> {

    if (this.checkoutData.length > 0) {
      return of(this.checkoutData);
    } else{
      return this.http.get<Product>(this.productUrl)
    }
   }
   getProductById(id: string): Observable<Product>{
     return this.http.get<Product>(this.productUrl +'/'+ id )
   }
   getrestaurantById(id:any){
    return this.http.get(`${this.getdeviceUrl}/${id}`)
  }
   
  setCheckoutData(data: any) {
    this.checkoutData = data;
  }
  getCheckoutData() {
    return this.checkoutData;
  }
}
