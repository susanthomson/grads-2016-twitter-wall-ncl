import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Subject } from "rxjs/Subject";

import "rxjs/add/operator/toPromise";

@Injectable()
export class TwitterLogin {
    private loginError = new Subject<boolean>();
    public loginErrorEvent$ = this.loginError.asObservable();

    constructor(private http: Http) {}

    login() {
        this.http.get("api/login").toPromise().then((res) => {
            let url = (res as any)._body;
            if (url) {
                window.location.href = url;
            }
        }).catch((res) => {
            this.loginError.next(true);
        });
    }

    changeCredentials() {
        let token;
        let handle;
        if ((token = window.sessionStorage.getItem("token")) !== null && (handle = window.sessionStorage.getItem("handle")) !== null) {
            this.http.get("api/login/change?handle=" + handle + "&token=" + token).toPromise().catch((res) => {
                this.loginError.next(true);
            });
        }
    }
}
