import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

interface EmployeeLoginResult {
  status: boolean;
  error: string;
}

@Injectable()
export class SecurityService {
  private headers: HttpHeaders;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private authorityUrl = '';
  public UserData: any;
  constructor(private router: Router, private storageService: StorageService) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');

    if (this.storageService.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storageService.retrieve('IsAuthorized');
      this.authenticationSource.next(true);
      this.UserData = this.storageService.retrieve('userData');
    }
  }

  public IsAuthorized!: boolean;

  public GetToken(): any {
    return this.storageService.retrieve('authorizationData');
  }

  public ResetAuthorizationData() {
    this.storageService.store('authorizationData', '');
    this.storageService.store('authorizationDataIdToken', '');

    this.IsAuthorized = false;
    this.storageService.store('IsAuthorized', false);
  }

  public SetAuthorizationData(token: any, idToken?: any) {
    if (this.storageService.retrieve('authorizationData') !== '') {
      this.storageService.store('authorizationData', '');
    }
    this.storageService.store('authorizationData', token);
    if (idToken) this.storageService.store('authorizationDataIdToken', idToken);
    this.IsAuthorized = true;
    this.storageService.store('IsAuthorized', true);
    window.location.hash = '';
    this.authenticationSource.next(true);
  }

  public Authorize() {
    this.ResetAuthorizationData();
    const authorizationUrl = this.authorityUrl + '/connect/authorize';
    const clientId = 'patronworks_web';
    const redirectURI = location.origin; // + '/';
    const responseType = 'id_token token';
    const scope = 'openid profile user patronworks';
    const postLogoutRedirectURI = location.origin; // + '/';
    const nonce = 'N' + Math.random() + '' + Date.now();
    const state = Date.now() + '' + Math.random();

    this.storageService.store('authStateControl', state);
    this.storageService.store('authNonce', nonce);
    this.storageService.store('path', location.pathname, true);
    const url =
      authorizationUrl +
      '?' +
      'response_type=' +
      encodeURI(responseType) +
      '&' +
      'client_id=' +
      encodeURI(clientId) +
      '&' +
      'redirect_uri=' +
      encodeURI(redirectURI) +
      '&' +
      'scope=' +
      encodeURI(scope) +
      '&' +
      'nonce=' +
      encodeURI(nonce) +
      '&' +
      'state=' +
      encodeURI(state);

    // window.location.href = url;
  }

  public AuthorizedCallback() {
    this.ResetAuthorizationData();

    const hash = window.location.hash.substr(1);

    const result: any = hash.split('&').reduce((result2: any, item: string) => {
      const parts = item.split('=');
      result2[parts[0]] = parts[1];
      return result2;
    }, {});

    // console.log(result);

    let token = '';
    let idToken = '';
    let authResponseIsValid = false;

    if (!result.error) {
      if (result.state !== this.storageService.retrieve('authStateControl')) {
        // console.log('AuthorizedCallback incorrect state');
      } else {
        token = result.access_token;
        idToken = result.id_token;

        const dataIdToken: any = this.getDataFromToken(idToken);
        // console.log(dataIdToken);

        // validate nonce
        if (dataIdToken.nonce !== this.storageService.retrieve('authNonce')) {
          // console.log('AuthorizedCallback incorrect nonce');
        } else {
          this.storageService.store('authNonce', '');
          this.storageService.store('authStateControl', '');
          const lastpath = this.storageService.retrieve('path', true);
          this.router.navigate([lastpath]);
          authResponseIsValid = true;
          // console.log('AuthorizedCallback state and nonce validated, returning access token');
        }
      }
    }

    if (authResponseIsValid) {
      this.SetAuthorizationData(token, idToken);
    }
  }

  public Logoff() {
    const authorizationUrl = this.authorityUrl + '/connect/endsession';
    const idTokenHint = this.storageService.retrieve(
      'authorizationDataIdToken'
    );
    const postLogoutRedirectURI = location.origin;

    const url =
      authorizationUrl +
      '?' +
      'id_token_hint=' +
      encodeURI(idTokenHint) +
      '&' +
      'post_logout_redirect_uri=' +
      encodeURI(postLogoutRedirectURI);

    this.ResetAuthorizationData();

    // emit observable
    this.authenticationSource.next(false);
    window.location.href = url;
  }

  public HandleError(error: any) {
    // console.log(error);
    if (error.status === 403) {
      this.router.navigate(['/Forbidden']);
    } else if (error.status === 401) {
      this.Authorize();
      // his.ResetAuthorizationData();
      // this.router.navigate(['/Unauthorized']);
    }
  }

  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    return window.atob(output);
  }

  private getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
      const encoded = token.split('.')[1];
      data = JSON.parse(this.urlBase64Decode(encoded));
    }

    return data;
  }

  //coded on 18-07
  setAuthToken(token: any) {
    this.storageService.store('authorizationData', token);
  }
  setStripeId(id: any) {
    this.storageService.store('stripeId', id);
  }
  setStripeAcessToken(token: any) {
    this.storageService.store('acessToken', token);
  }
  setStripeRefreshToken(token: any) {
    this.storageService.store('refreshToken', token);
  }
  setIsRole(data: any) {
    this.storageService.store('superUserData', JSON.stringify(data));
  }
  setIsEmployee(data: boolean) {
    this.storageService.store('isEmployee', data);
  }
  setEmployeeName(data: any) {
    this.storageService.store('EmployeeName', data);
  }
  setEmployeeType(data: any) {
    this.storageService.store('EmployeeType', data);
  }
  setEmployeeId(data: any) {
    this.storageService.store('EmployeeId', data);
  }
  setemployeeTime(data: any) {
    this.storageService.store('EmployeeTime', data);
  }
  setUserData(user: any) {
    this.storageService.store('userData', JSON.stringify(user));
  }
  setUserAllData(user: any) {
    this.storageService.store('userAllData', user);
  }
  setUserfee(userFee: any) {
    this.storageService.store('userFee', userFee);
  }
  setUserEmail(email: any) {
    this.storageService.store('userEmail', email);
  }
  setLoginDate(date: Date) {
    this.storageService.store('loginDate', date);
  }
  setTerminalConnection(Token: any) {
    this.storageService.store('connectionToken', Token);
  }
  setReaderId(Reader: any) {
    this.storageService.store('reader', Reader);
  }
  getTerminalConnection() {
    return this.storageService.retrieve('connectionToken');
  }
  getReaderId() {
    return this.storageService.retrieve('reader');
  }
  getIsEmpoyee() {
    return this.storageService.retrieve('isEmployee');
  }
  getEmpoyeeName() {
    return this.storageService.retrieve('EmployeeName');
  }
  getEmployeeType() {
    return this.storageService.retrieve('EmployeeType');
  }
  getEmpoyeeId() {
    return this.storageService.retrieve('EmployeeId');
  }
  getemployeeTime() {
    return this.storageService.retrieve('EmployeeTime');
  }
  getAuthToken() {
    return this.storageService.retrieve('authorizationData');
  }
  getStripeId() {
    return this.storageService.retrieve('stripeId');
  }
  getStripeAcessToken() {
    return this.storageService.retrieve('acessToken');
  }
  getStripeRefreshToken() {
    return this.storageService.retrieve('refreshToken');
  }
  getUserData() {
    return JSON.parse(this.storageService.retrieve('userData') || '');
  }
  getUserAllData() {
    return this.storageService.retrieve('userAllData') || '';
  }
  getUserfee() {
    return this.storageService.retrieve('userFee') || 0;
  }
  getUserEmail() {
    return this.storageService.retrieve('userEmail');
  }
  getIsRole() {
    return JSON.parse(this.storageService.retrieve('superUserData') || '');
  }
  getLoginDate() {
    // return JSON.parse(this.storageService.retrieve('loginDate') || '')
    return this.storageService.retrieve('loginDate');
  }
  logOut() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['/auth/login']);
    // this.router.navigate(['/auth/login']);
  }
  logOutPos() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['/poslogin']);
  }
}
