import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    address: '',
    guests: null,
    reserveDate: '',
    reserveTime: '',
    userId: environment.userId,
    reservedstatus: 'Online',
    firstName:'', 
    lastName:'',
    contactNumber:'',
  }

  constructor(public reservationService: ReservationService
    ,   public dialogRef: MatDialogRef<ReservationComponent>
  ) { 
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
        }).then(() => {
          console.log('Reservation Response:', response);
        this.reservationData = {
          address: '',
          guests: null,
          reserveDate: '',
          reserveTime: '',
          userId: environment.userId,
          reservedstatus: 'Online',
          firstName: '',
          lastName: '',
          contactNumber: '',
        };
        this.dialogRef.close();
        });
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
