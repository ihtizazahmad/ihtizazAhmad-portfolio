import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  map,
  Observable,
} from 'rxjs';
import { tax } from '../components/interfaces/tax';

import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(private http: HttpClient) { }

  apiurl = environment.apiUrl;
  postorderurl = this.apiurl + '/tax';

  getTax(): Observable<tax[]> {
    return this.http.get<tax[]>(`${this.apiurl}/tax`,)
  }

  getDefaultTax(): Observable<any> {
    return this.http.get<any[]>(`${this.apiurl}/tax`).pipe(
      map(taxes => taxes.find(tax => tax.byDefault === true) || null)
    );
  }
}
