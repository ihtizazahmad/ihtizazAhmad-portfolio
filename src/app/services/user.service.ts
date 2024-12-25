import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  tap,
} from 'rxjs';

import { environment } from '../environment/environment';
import { user } from '../components/interfaces/user';
import { IUserLogin } from '../components/interfaces/userlogin';
import { IUserRegister } from '../components/interfaces/userRegister';
import Swal from 'sweetalert2';



const USER_KEY = 'user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
private userSubject = new BehaviorSubject<user>(this.getUserFromLocalStorage());
public userObservable : Observable<user>;
  alert: any;
constructor(private http : HttpClient, ) {
  this.userObservable = this.userSubject.asObservable();
}
apiUrl = environment.apiUrl;
userLogUrl = this.apiUrl+ '/clogin'
userRegUrl = this.apiUrl+ '/cregister'
getcustomerurl = this.apiUrl + '/customer'
devicesUrl = this.apiUrl + '/device'
userGetUrl=this.apiUrl + '/user'




public get currentUser(): user{
  return this.userSubject.value;
}

login(userLogin: IUserLogin):Observable<user>{
  return this.http.post<user>(this.userLogUrl, userLogin).pipe(
    tap({
      next : (user)=>{
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful Welcome to Foodmine',
          showConfirmButton: false,
          timer: 1500 // Show the pop-up for 2.5 seconds (adjust as needed)
        });
      },
      error: (errorResponse)=>{
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: errorResponse.error || 'Login Failed',
        });
      }
    })
  )
}
register(userRegiser:IUserRegister){
  return this.http.post<user>(this.userRegUrl, userRegiser).pipe(
    tap({
      next: (user) => {
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        Swal.fire({
          icon: 'success',
          title: 'Register Successful Welcome to Foodmine',
          showConfirmButton: false,
          timer: 1500 // Show the pop-up for 2.5 seconds (adjust as needed)
        });
      },
      error: (errorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: errorResponse.error || 'Register Failed',
        });

       
      }
    })
  )
}


logout(){
  this.userSubject.next(new user());
  localStorage.removeItem(USER_KEY);
  window.location.reload();
}
  private setUserToLocalStorage(user : user){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  private getUserFromLocalStorage(): user{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as user;
    return new user();
  }


  getcustomerById(_id:string):Observable<user>{
    return this.http.get<user>(`${this.getcustomerurl}/${_id}`)
  }


  getcustomer():Observable<user>{
    return this.http.get<user>(this.getcustomerurl)

  }

  postCustomer(newCustomerData:any){
    return this.http.post(this.getcustomerurl,newCustomerData)
  }

  getDevices(){
  return this.http.get(this.devicesUrl)
  }

  getUserById(_id:string):Observable<user>{ 
    return this.http.get<user>(`${this.userGetUrl}/${_id}`)
  }
}

