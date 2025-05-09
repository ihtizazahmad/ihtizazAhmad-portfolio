import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  userId = '66fc5fb8aef1d315dc9fd4e6';
  //  for test mode-->
  // userId = '65d6e2acf4cb2c368afded71';
  userEmail: any;
  businessName: any;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const userData = res[0];
          this.userEmail = userData?.email;
          this.businessName = userData?.businessName;
        }
      },
      error(err) {
        console.error('Getting error while getting user data:', err);
      },
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = {
        fullName: this.contactForm.value.name,
        email: this.contactForm.value.email,
        company: this.businessName,
        message: this.contactForm.value.message,
      };
      this.userService.sendMessage(formData).subscribe(
        (res: any) => {
          if (res) {
            this.contactForm.reset();
            Swal.fire({
              title: 'Success!',
              text: 'Your message has been sent successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue sending your message. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
