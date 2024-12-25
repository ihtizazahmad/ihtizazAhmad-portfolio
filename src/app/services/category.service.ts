import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../components/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public apiUrl = environment.apiUrl
  parentcategoryUrl = this.apiUrl + '/parentcategory';  
  constructor(private http:HttpClient,) { }

  
  getCategory():Observable<any> {
    return this.http.get<any>(this.parentcategoryUrl)
   }
   getCategoryById(id: string): Observable<any>{
     return this.http.get<any>(this.parentcategoryUrl +'/'+ id )
   }
   getParentCategoryById(id:string) {
    return this.http.get<any>(this.parentcategoryUrl + '/' + id);
  }
  // getParentCategory() {
  //   let Userid:any =  this.securityService.getUserData()?._id;
  //   return this.http.get<any>(this.apiUrl + '/parentcategory'+`?userId=${Userid}`);
  // }
}
