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
  getdeviceUrl = this.apiUrl + '/device';
  modifierUrl = this.apiUrl + '/categories1';
  userId = '674ba2d30e062b07414d6704'; 

  //  for test mode-->
  //  userId = '65d6e2acf4cb2c368afded71'; 
  constructor(private http:HttpClient,) { }

  
  getProducts():Observable<Product[]> {
      return this.http.get<Product[]>(this.productUrl + `?userId=${this.userId}`)
    
   }
   getProductById(id: string): Observable<Product>{
     return this.http.get<Product>(this.productUrl +'/'+ id )
   }
   getrestaurantById(){
    return this.http.get(`${this.getdeviceUrl}/?userId=${this.userId}`)
  }
   
  setCheckoutData(data: any) {
    this.checkoutData = data;
  }
  getCheckoutData() {
    return this.checkoutData;
  }

  getModierByUserId():Observable<any>{
    return this.http.get<any>(`${this.modifierUrl}?userId=${this.userId}`);
  }
}
