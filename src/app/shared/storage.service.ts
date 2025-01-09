import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class StorageService {
    private sessionStorage: any;
    private localStorage: any;
    btn:any
    private sideButton = new Subject<any>();

    constructor() {
        this.sessionStorage = sessionStorage; // localStorage;
        this.localStorage = localStorage; // localStorage;
    }

    public retrieve(key: string, localStorage: boolean = true): any {

        const storage: any = localStorage ? this.localStorage : this.sessionStorage;
        const item = storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(storage.getItem(key));
        }

        return;
    }

    public store(key: string, value: any, localStorage: boolean = true) {
        const storage: any = localStorage ? this.localStorage : this.sessionStorage;
        storage.setItem(key, JSON.stringify(value));
    }
    setsidebtn(status:any){
      this.btn=status
      this.sideButton.next(status);
    }
}

