import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdertypeService {
  constructor(private http : HttpClient){}
  apiurl= environment.apiUrl;
  postorderurl = this.apiurl+'/orderitem'
  selectedCardTitle: string = '';
  updateSelectedCardTitle(title: string) {
    this.selectedCardTitle = title;
  }
  makePayments(stripeToken: any, userId: any,superUserId:any): Observable<any> {
    const url = `${this.apiurl}/credit`
    const body ={
      stripeToken,
      userId,
      superUserId
    }
    return this.http.post<any>(url,body)
  }
postOrder(orderData : any){
 return this.http.post(this.postorderurl, orderData)
}
getOrder(){
  return this.http.get(this.postorderurl)
}
}
