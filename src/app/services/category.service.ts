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
  categoryUrl = this.apiUrl + '/category'; 
  userId = environment.userId; 
  constructor(private http:HttpClient,) { }

  
  getCategory():Observable<any> {
    return this.http.get<any>(this.parentcategoryUrl + `?userId=${this.userId}`)
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

  // Sub Categories

  getSubCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.categoryUrl + `?userId=${this.userId}`)
  }
}
