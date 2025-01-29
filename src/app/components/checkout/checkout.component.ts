import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from '../interfaces/order';
import { ProductService } from 'src/app/services/product.service';
import { OrdertypeService } from 'src/app/services/ordertype.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environment/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { TaxService } from 'src/app/services/tax.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild('printDataDiv', { static: false }) printDataDiv!: ElementRef<any>;
  @ViewChild('customertDataDiv', { static: false })
  customertDataDiv!: ElementRef<any>;
  @ViewChild('paymentOptionSection') paymentOptionSection!: ElementRef;
  showPaymentUi: boolean = false;
  todayDate = new Date();
  subtotal: any;
  userForm!: FormGroup;
  checkoutData: any;
  orderNo: string;
  order: Order = new Order();
  userData: any;
  userId: any;
  AppFee: any;
  total: any;
  customerEmail: any;
  customerName: any;
  customerPhone: any;
  isLoading: boolean = false;
  userEmail: any;
  stripeAccessToken: any;
  paymentIntentId: any;
  client_secret: any;
  stripe!: Promise<Stripe>;
  modifierPrice: number = 0;
  modifires: any = [];
  productWithQty: any;
  food: any = [];
  businessData: any;
  deliveryFee: any;
  location: any;
  ChargesPerKm: any;
  freeDelivery: any;
  customerAdreesName: any;
  officelocation: any;
  defaultOfficelocation: any;
  FinaldistanceTax: any;
  apiKeyForLocation = '5ef919622d0841d0832dba6448c69161';
  distance: any;
  distanceDifference: any;
  map: any;
  product: any[] = [];
  tax: number = 0;
  taxId: any;
  taxvalue: any;
  taxName: any;
  addtax: any;
  defaultTax: any[] = [];
  businessId = '674ba2d30e062b07414d6704';

  initMap() {
    this.map?.locate({ setView: true, maxZoom: 15 });
    if (this.businessData?.delivery === 'true') {
      if (
        this.defaultOfficelocation &&
        this.defaultOfficelocation?.latitude !== undefined &&
        this.defaultOfficelocation?.longitude !== undefined
      ) {
        console.log(
          'Office location - Latitude:',
          this.defaultOfficelocation.latitude
        );
        console.log(
          'Office location - Longitude:',
          this.defaultOfficelocation.longitude
        );
      } else {
        console.error('Office location coordinates are not defined.');
      }
      if (
        this.officelocation?.latitude !== undefined &&
        this.officelocation?.longitude !== undefined
      ) {
        console.log(
          'Office location - Latitude:',
          this.officelocation.latitude
        );
        console.log(
          'Office location - Longitude:',
          this.officelocation.longitude
        );
      } else {
        console.error('Office location coordinates are not defined.');
      }
    } else if (this.businessData?.delivery === 'false') {
      if (
        this.defaultOfficelocation &&
        this.defaultOfficelocation?.latitude !== undefined &&
        this.defaultOfficelocation?.longitude !== undefined
      ) {
      } else {
        console.error('Office location coordinates are not defined.');
      }
    }
  }
  constructor(
    public cartService: CartService,
    public productService: ProductService,
    private router: Router,
    private orderService: OrdertypeService,
    private userService: UserService,
    private taxService : TaxService
  ) {
    this.cartService.getCartObservable().subscribe((cart) => {
      console.log('getting cart observable:', cart);
      this.subtotal = cart.totalPrice;
      this.modifierPrice = cart.modifierPrice;
      this.product = cart.items;
      this.checkoutData = cart;
      this.productWithQty = this.product.map((x: any) => {
        return {
          productId: x?.food?._id,
          qty: x.quantity,
          price: x.price,
          ...x.disobj,
        };
      });
      this.product.map((i: any) => {
        if (i.food) {
          this.food.push(i.food);
        }
        if (i.food?.modifiers) {
          this.modifires.push(i?.food?.modifiers);
        }
      });

      this.order = this.checkoutData;
    });
    this.orderNo = this.generateRandomNumber();
  }
  formData = {
    fName: '',
    lName: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };
  ngOnInit(): void {
    this.productService.getrestaurantById().subscribe((res: any) => {
      if (res) {
        this.businessData = res[0];
        console.log('business data :', this.businessData);
        this.deliveryFee = this.businessData?.deliveryFee;
        if (this.businessData?.delivery === 'true') {
          this.fetchData();
        }
      }
    });
    this.userData = this.product[0]?.food?.userId;
    this.userEmail = this.userData?.email;
    this.userId = this.userData?._id;
    this.AppFee = this.userData?.appFee;
    if (this.userData) {
      this.total = this.subtotal + this.AppFee;
    }

    this.getTax();
  }

  getTax() {
    this.taxService.getTax().subscribe((res: any) => {
      const applicableTaxes = res.filter(
        (item: any) => item?.userId === this.businessId
      );
      console.log('Filtered applicable taxes:', applicableTaxes);
      let totalTaxPercentage = applicableTaxes.reduce(
        (sum: number, tax: any) => sum + Number(tax.taxValue),
        0
      );
      console.log("first find tatal tax:", totalTaxPercentage)
      console.log("first find tatal tax:", this.subtotal)
      this.addtax = (this.subtotal * totalTaxPercentage) / 100;
      this.defaultTax = [];
      applicableTaxes.forEach((tax: any) => {
        const taxValue = Number(tax.taxValue);
        const taxAmount = (this.subtotal * taxValue) / 100;
        this.defaultTax.push({
          name: tax.name,
          addtax: taxAmount,
        });
      });
      console.log("stufion  : ", this.addtax)
    });
  }

  onSubmit() {
    console.log('Form Submitted', this.formData);
    alert('Checkout Completed Successfully!');
  }
  async fetchData() {
    try {
      new Promise<void>((resolve) => {
        this.location = this.businessData?.Line1;
        this.ChargesPerKm = this.businessData?.ChargesperKm.toFixed(2);

        this.freeDelivery = this.businessData?.ChargesFreeKm;

        resolve();
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  addressFieldChange() {
    const inputValue = this.customerAdreesName.trim();
    if (inputValue === '') {
      this.officelocation = '';
      this.defaultOfficelocation = '';
      const charges = this.total - this.FinaldistanceTax;
      this.total = charges;
      this.FinaldistanceTax = 0;
    } else {
      this.getCustomerLocation(inputValue);
    }
  }
  handlePaste(event: ClipboardEvent) {
    setTimeout(() => {
      this.addressFieldChange();
    }, 100); 
  }
  capturePrintDataContent(): string {
    return this.printDataDiv?.nativeElement.innerHTML;
  }

  captureCustomerDataContent(): string {
    return this.customertDataDiv?.nativeElement.innerHTML;
  }

  sendEmail() {
    const printDataContent = this.capturePrintDataContent();
    this.orderService.sendReciept(this.userEmail, printDataContent).subscribe({
      next: (res: any) => {
        console.log('Email sent:', res);
      },
      error: (error) => {
        console.log('Email not sent:', error);
      },
    });
  }
  sendEmail2(email: any) {
    const customerData = this.captureCustomerDataContent();
    this.orderService.sendReciept(email, customerData).subscribe({
      next: (res: any) => {
        console.log('Email sent:', res);
      },
      error: (error) => {
        console.log('Email not sent:', error);
      },
    });
  }

  loadcurrentloaction() {
    let currentlocation1 = 'CurrentLocation';
    this.getCustomerLocation(currentlocation1);
  }
  async getCustomerLocation(inputValue: any) {
    console.log('this is inout value', inputValue);
    if (inputValue == 'CurrentLocation') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position: any) => {
          try {
            if (
              position &&
              position.coords &&
              typeof position.coords.latitude === 'number' &&
              typeof position.coords.longitude === 'number'
            ) {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };

              console.log(
                'this is customer location lat',
                location?.latitude as number
              );
              console.log(
                'this is  customer location long',
                location?.longitude as number
              );

              const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                `${location.latitude},${location.longitude}`
              )}&key=${this.apiKeyForLocation}`;
              try {
                console.log('Making API Request...');
                const response = await fetch(apiUrl);
                console.log('API Response:', response);

                const data = await response.json();
                console.log('Parsed JSON Data:', data);

                if (data.results && data.results.length > 0) {
                  const address = data.results[0].formatted;
                  console.log('Place Name:', address);
                  this.customerAdreesName = address;
                } else {
                  console.error('Unable to fetch place name.');
                }
              } catch (error) {
                console.error('Error fetching place name:', error);
              }

              const officeCoordinates = await this.getLocationCoordinates(
                this.location
              );
              console.log('officeCoordinates: ', officeCoordinates);
              if (officeCoordinates) {
                this.officelocation = {
                  latitude: officeCoordinates.latitude,
                  longitude: officeCoordinates.longitude,
                };
                const distance = this.calculateDistance(
                  this.officelocation?.latitude as number,
                  this.officelocation?.longitude as number,
                  location.latitude,
                  location.longitude
                );
                this.distance = distance;
                const DistanceMinusTen = distance - this.freeDelivery;
                this.distanceDifference = DistanceMinusTen;
                const FinaldistanceTax = DistanceMinusTen * this.ChargesPerKm;
                this.FinaldistanceTax = FinaldistanceTax;
                console.log(
                  'final sitance apply become doller ',
                  FinaldistanceTax
                );
                this.order.deliveryfee = this.FinaldistanceTax;
                const charges = this.total + this.FinaldistanceTax;
                console.log('Applying $10 charges...', charges);
                this.total = charges;
                // this.initMap();
              } else {
                console.error(
                  'Failed to obtain office location coordinates. Check getLocationCoordinates function.'
                );
              }
            } else {
              console.error('Invalid coordinates in the position object');
            }
          } catch (error) {
            console.error('Error in getCustomerLocation:', error);
          }
        });
      } else {
        console.log('Geolocation is not available in this browser.');
      }
    } else {
      try {
        const coordinates = await this.getLocationCoordinates(inputValue);

        if (coordinates) {
          console.log('Coordinates found');
          const location = {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          };
          const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            `${location.latitude},${location.longitude}`
          )}&key=${this.apiKeyForLocation}`;
          try {
            console.log('Making API Request...');
            const response = await fetch(apiUrl);
            console.log('API Response:', response);

            const data = await response.json();
            console.log('Parsed JSON Data:', data);

            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted;
              console.log('Place Name:', address);
              this.customerAdreesName = address;
            } else {
              console.error('Unable to fetch place name.');
            }
          } catch (error) {
            console.error('Error fetching place name:', error);
          }

          const officeCoordinates = await this.getLocationCoordinates(
            this.location
          );
          if (officeCoordinates) {
            this.officelocation = {
              latitude: officeCoordinates.latitude,
              longitude: officeCoordinates.longitude,
            };
            const distance = this.calculateDistance(
              this.officelocation?.latitude as number,
              this.officelocation?.longitude as number,
              location.latitude,
              location.longitude
            );
            this.distance = distance;
            const DistanceMinusTen = distance - this.freeDelivery;
            this.distanceDifference = DistanceMinusTen;
            const FinaldistanceTax = DistanceMinusTen * this.ChargesPerKm;
            this.FinaldistanceTax = FinaldistanceTax;
            this.order.deliveryfee = this.FinaldistanceTax;
            const charges = this.total + this.FinaldistanceTax;
            this.total = charges;
            // this.initMap();
          } else {
            console.error(
              'Failed to obtain office location coordinates. Check getLocationCoordinates function.'
            );
          }
        } else {
          console.log('Coordinates not found');
        }
      } catch (error) {
        console.error('Error getting coordinates:', error);
      }
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance;
  }

  valueChanges() {
    if (this.customerAdreesName.trim().length == 0) {
      this.officelocation = '';
      this.defaultOfficelocation.latitude = 0;
      this.defaultOfficelocation.longitude = 0;
      const charges = this.total - this.FinaldistanceTax;
      this.total = charges;
      this.FinaldistanceTax = 0;
      this.officelocation.latitude = 0;
      this.officelocation.longitude = 0;
    }
  }

  async getLocationCoordinates(location: any) {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${this.apiKeyForLocation}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          return { latitude: lat, longitude: lng };
        } else {
          console.error(
            'Geocoding API request succeeded, but no results found.'
          );
          return null;
        }
      } else {
        console.error(
          `Geocoding API request failed with status: ${response.status}`
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  }
  generateRandomNumber(): string {
    const min = 10000;
    const max = 99999;
    let randomNum: string;
    const usedNumbers = JSON.parse(localStorage.getItem('usedNumbers') || '[]');
    do {
      randomNum = String(Math.floor(Math.random() * (max - min + 1)) + min);
    } while (usedNumbers.includes(randomNum));
    usedNumbers.push(randomNum);
    localStorage.setItem('usedNumbers', JSON.stringify(usedNumbers));
    return randomNum;
  }
  goBack() {
    // this.backToLocation.back();
  }

  makePayment(formData: any, order: any, status: any) {
    console.log('fromData :', formData);
    Swal.fire({
      title: 'Orders are temporarily unavailable due to ongoing work in the background. Please try again later.',
      icon: 'warning',
      confirmButtonText: 'OK',
    }).then(() => {
       this.router.navigate(['/']);
    });
    return ;
    if (
      !formData ||
      !formData.value ||
      !formData.value.Email ||
      !formData.value.FirstName ||
      !formData.value.LastName
    ) {
      console.log('formDAta  in condition :', formData);
      Swal.fire({
        icon: 'error',
        title: 'Form is not valid',
        text: 'Please fill in all required fields.',
      });
      return;
    }
    order.paymentStatus = status;
    this.stripeAccessToken = this.userData?.stripeAcessToken;
    const amountInDollars = this.total;
    const amountInCents = Math.round(amountInDollars * 100);
    const feeAmountInDollars = this.AppFee || 30;
    const feeAmountInCents = Math.round(feeAmountInDollars * 100);

    let data = {
      amount: amountInCents,
      currency: 'usd',
      description: 'pos order charge',
      application_fee_amount: feeAmountInCents,
      stripeAccount: this.userData?.stripe_account_id,
    };

    this.orderService.paymentIntent(data).subscribe((data) => {
      this.paymentOptionSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
      console.log('getitng data from intent payment: ', data.paymentIntent);
      if (data) {
        this.showPaymentUi = true;
        this.paymentIntentId = data.paymentIntent.id;
        this.client_secret = data.paymentIntent?.client_secret;
        const appearance = {
          theme: 'stripe' as 'stripe',
        };
        const paymentOptions = {
          layout: 'tabs' as 'tabs',
        };
        this.stripe = loadStripe(environment?.stripeKey) as Promise<Stripe>;
        this.stripe
          ?.then((stripe) => {
            if (!this.client_secret) {
              console.log('Client secret is missing!');
              return;
            }

            const elements = stripe?.elements({
              appearance: appearance,
              clientSecret: this.client_secret,
            });
            const paymentElement = elements.create('payment', paymentOptions);
            paymentElement.mount('#paymentElement');

            const form = document.getElementById('payment-form');
            form?.addEventListener('submit', async (event) => {
              event.preventDefault();
              const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                  return_url: 'http://localhost:4200/',
                },
                redirect: 'if_required',
              });
              if (error) {
                console.log('error :', error);
              } else {
                if (paymentIntent?.status === 'requires_capture') {
                  this.confirmPayment(formData, order);
                } else if (paymentIntent?.status === 'requires_action') {
                  Swal.fire('try again or choose another method for Payment');
                } else if (
                  paymentIntent?.status === 'requires_payment_method'
                ) {
                  Swal.fire('payment failed requires payment method ');
                } else {
                  Swal.fire('Payment Successful');
                }
              }
            });
          })
          .catch((error) => {
            console.log('Failed to load Stripe :', error);
          });
      } else {
        Swal.fire('Payment error');
      }
    });
  }

  confirmPayment(formData: any, order: Order) {
    this.orderService.capturePaymentIntent(this.paymentIntentId).subscribe({
      next: (res: any) => {
        if (res) {
          this.showPaymentUi = true;
          Swal.fire({
            title: 'Payment Success',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.createOrder(formData, order).then((res: any) => {
                if (res) {
                  this.router.navigate(['/']);
                }
              });
            }
          });
        }
      },
      error: (err) => {
        console.log('error :', err);
        if (err) {
          Swal.fire('Payment error');
        }
      },
    });
  }

  async createOrder(formData: NgForm, order: Order) {
    try {
      console.log('formDatasd :', order);
      console.log('formDatas :', this.order);
      console.log('formData :', formData.value);
      if (formData.value) {
        this.customerEmail = formData.value?.Email;
        this.customerName = `${formData.value?.FirstName}${formData.value?.LastName}`;
        this.customerPhone = formData.value?.phone;

        if (!formData || !formData.value || !formData.value.Email) {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Form is not valid',
            text: 'Please fill in all required fields.',
          });
        }
        this.userService.getCostumer().subscribe((res: any) => {
          if (res) {
            const customerEmail = res.map((i: any) => i.Email);
            const emailExist = customerEmail.includes(this.customerEmail);
            if (emailExist) {
              if (formData.status === 'VALID') {
                const existingCustomer = res.find(
                  (customer: any) => customer.Email === this.customerEmail
                );
                console.log('Customer found. Placing order.. valid valid.');

                let order = {
                  product: this.food,
                  userId: this.userId,
                  orderStatus: 'online',
                  productWithQty: this.productWithQty,
                  customerId: existingCustomer?._id,
                  tax: this.order?.tax,
                  taxValue: this.order?.taxValue,
                  subtotal: this?.total,
                  selectedModifiers: this.modifires,
                  priceExclTax: this?.total,
                  PaymentStatus: status,
                  deliveryfee: this.order.deliveryfee,
                };
                console.log('first confirmation of res', order);

                this.orderService.createOrder(order).subscribe((res) => {
                  if (res) {
                    console.log('email send in if block');
                    console.log('this is mail no 2 user', formData.value.email);

                    // this.sendEmail2(formData.value?.Email);
                    // this.sendEmail();
                    this.isLoading = false;

                    Swal.fire({
                      icon: 'success',
                      title: 'order Successful',
                      text: 'Congratulations! Your order for the selected products has been successful.For further details and confirmation, please check your email.',
                    }).then(() => {
                      this.cartService.clearCart();
                      this.router.navigate(['/']);
                    });
                  }
                });
              } else {
                this.isLoading = false;

                Swal.fire({
                  icon: 'error',
                  title: 'Form is not valid',
                  text: 'Please fill in all required fields.',
                });
              }
            } else if (!emailExist) {
              if (formData.status === 'VALID') {
                console.log('Email not found');

                const newCustomerData = {
                  Email: this.customerEmail,
                  FirstName: formData.value?.FirstName,
                  LastName: formData.value?.LastName,
                  address: formData.value?.address,
                  CompanyName: formData.value?.company_name,
                  phone: formData.value?.phone,
                  PostalCode: formData.value.postcode,
                  City: formData.value.city,
                  card: {
                    number: formData.value.cardNumber,
                    exp_month: formData.value.expiration_month,
                    exp_year: formData.value.expiration_year,
                    cvc: formData.value.cvv,
                  },
                  name: formData.value.nameoncard,
                  countryName: formData.value.countryName,
                };

                this.userService
                  .postCustomer(newCustomerData)
                  .subscribe((res: any) => {
                    if (res) {
                      let order = {
                        customerId: res._id,
                        product: this.food,
                        orderStatus: 'online',
                        userId: this.userData,
                        productWithQty: this.productWithQty,
                        selectedModifiers: this.modifires,
                        tax: this.order?.tax,
                        taxValue: this.order?.taxValue,
                        PaymentStatus: this.order?.PaymentStatus,
                        priceExclTax: this?.total,
                        subtotal: this?.total,
                        deliveryfee: this.deliveryFee,
                      };

                      this.orderService.createOrder(order).subscribe((res) => {
                        if (res) {
                          // this.sendEmail2(formData.value?.Email);
                          // this.sendEmail();
                          this.isLoading = false;

                          Swal.fire({
                            icon: 'success',
                            title: 'order Successful',
                            text: 'Congratulations! Your order for the selected products has been successful.For further details and confirmation, please check your email.',
                          }).then(() => {
                            this.cartService.clearCart();
                            this.router.navigate(['/']);
                          });
                        }
                      });
                    }
                  });
              } else {
                this.isLoading = false;

                Swal.fire({
                  icon: 'error',
                  title: 'Form is not valid',
                  text: 'Please fill in all required fields.',
                });
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}
