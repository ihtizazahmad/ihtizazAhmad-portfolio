import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  userId = environment.userId;
  ReservationUrl = environment.apiUrl + '/onlinereservation';
  constructor(private http: HttpClient) { }


  postReservation(reservationData:any){
    return this.http.post(this.ReservationUrl, reservationData)
  }

  
  getReservation(){
    return this.http.get(this.ReservationUrl)
  }


  getReservationById(id: string): Observable<any>{
    return this.http.get<any>(this.ReservationUrl +'/'+ id )
  }

  deleteReservation(id: string){
    return this.http.delete(this.ReservationUrl +'/'+ id )
  }

  getReservationsByUserId(): Observable<any> {
    return this.http.get<any>(`${this.ReservationUrl}/${this.userId}`);
  }

}
