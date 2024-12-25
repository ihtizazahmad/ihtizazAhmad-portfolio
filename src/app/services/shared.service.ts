import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl=environment.apiUrl;
  recieptUrl = this.apiUrl + '/sendCourseEmail '
  contactusurl = this.apiUrl + '/receive'

  private RestourantIdSource = new BehaviorSubject<string | null>(null);
  itemId$ = this.RestourantIdSource.asObservable();

  
  // here send the category info to getegory component from product component
  private categoryInfo = new BehaviorSubject<string | null>(null);
  category$ = this.categoryInfo.asObservable();


  // here send the category_id to productcomponent from categgoory component
  private categoryIdSource = new BehaviorSubject<string | null>(null);
  categoryId$ = this.categoryIdSource.asObservable();
  constructor(public http:HttpClient) { }



  setItemId(itemId: string) {
    this.RestourantIdSource.next(itemId);
  }

  sendReciept(email:string, recieptContent: any):Observable<any>{
    const payload = {
      email:email,
      recieptContent:recieptContent
    }
    return this.http.post(this.recieptUrl, payload);
  }

  submitContactForm(formData: any, toEmail:any ): Observable<any> {
    const emailData = { ...formData, toEmail };
    return this.http.post(this.contactusurl, emailData );
  }

  sendcategory(category:any){
   this.categoryInfo.next(category)
  }


  setcategory_Id(categoryId: string) {
    this.categoryIdSource.next(categoryId);
  }

}
