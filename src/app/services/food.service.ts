import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  Observable,
  tap,
} from 'rxjs';
import { environment } from '../environment/environment';

import { Product } from '../components/interfaces/product';
import { Order } from '../components/interfaces/order';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  apiUrl=environment.apiUrl;
  productUrl = this.apiUrl+ '/filteredProduct';
  productUrls = this.apiUrl+ '/Product';
  searchProduct = this.apiUrl+ '/search/';
  reviewUrl = this.apiUrl + '/review'


  constructor(private http: HttpClient,
    private router: Router
  ) {

    }


    // getAll(): Observable<food[]>{
    //   return this.http.get<food[]>(FOODS_URL)
    // }
    getProducts():Observable<Product[]> {
      return this.http.get<Product[]>(this.productUrl);
    }
    getProduct(id: string): Observable<Product>{
      return this.http.get<Product>(this.productUrls +'/'+ id )
    }
    getFoodsBySearch(searchTerm: string){
      return this.http.get<Product[]>(this.searchProduct+ searchTerm)
    }
    postReview(reviewData:any){
      return this.http.post(this.reviewUrl, reviewData)

    }
    // apiUrl = environment.BASE_URL
    postOrderItem(orderItem: Order): Observable<Order[]>{
      return this.http.post<Order[]>(`${this.apiUrl}/orderitem`, orderItem)
        .pipe(
        tap({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Order Successfull',
              showConfirmButton: false,
              timer: 1500 // Show the pop-up for 2.5 seconds (adjust as needed)
            });
            // setTimeout(() => {
            //   this.router.navigate(['/'])
            //     .then(() => {
            //       window.location.reload();
            //     });
            // }, 5000);
             // 2 seconds delay
        //     this.router.navigate(['/'])
        // .then(() => {
        //   window.location.reload();
        // });
          },
          error: (errorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong',
              text: errorResponse.error || 'Unknown error',
            });
          }
        })
      )
  // console.log("orderItems post api", orderItem)
    }
    // getAllTags(): Observable<Tag[]>{
    //   return this.http.get<Tag[]>(FOODS_TAGS_URL);
    // }
    // getFoodByTags(tag:string): Observable<Product[]>{
    //   return tag === "All"? this.getProducts():
    //    this.http.get<Product[]>(FOODS_BY_TAG_URL + tag)
    // }

}
