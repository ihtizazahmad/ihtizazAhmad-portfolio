import { Component } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { ReservationService } from 'src/app/services/reservation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  reservationData = {
    location: '',
    guests: null,
    date: '',
    time: '',
    userId: environment.userId
  }

  constructor(public reservationService: ReservationService) { 
    // this.reservationService.getReservationsByUserId()
    //   .subscribe((response) => {  
    //     console.log('Reservation Response:', response);
    //   });
  }


  submitReservation() {
    console.log('Reservation Data:', this.reservationData);

    this.reservationService.postReservation(this.reservationData)
      .subscribe((response) => {
       Swal.fire({
          icon: 'success',
          title: 'Reservation Successfull',
          text: 'Your reservation has been successfully created',
          showConfirmButton: true,
        });
        console.log('Reservation Response:', response);
      });
  }
    

  // dlete() {
  //  const  id= "67bd758973a13486587eb8f8"
  //   this.reservationService.deleteReservation(id)
  //     .subscribe((response) => {
  //       console.log('Reservation Deleted:', response);
  //     });
  // }
}
