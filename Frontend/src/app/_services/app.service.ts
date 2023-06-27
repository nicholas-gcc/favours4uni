import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';  

import { environment } from "../../environments/environment";

@Injectable()
export class AppService {
    public SERVER_ADDRESS = environment.serverEndPoint;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        public router: Router
        ) {
    }

    setCurrentUser(token: any) {
        var reqHeader = new HttpHeaders({ 
            'Authorization': 'Bearer ' + (token)
         });
        return this.http.get(this.SERVER_ADDRESS + `/user`, { headers: reqHeader }).subscribe((response:any) => {
            this.cookieService.set('currentUser', JSON.stringify(response.userCredentials));
        });
    }

    getCurrentUser() {
        if (this.cookieService.get('currentUser') != ''){
            return JSON.parse(this.cookieService.get('currentUser'));
        } else {
            return null;
        }
    }

    setToken(value:any) {
        this.cookieService.set('token', value);
    }

    getToken() {
        return this.cookieService.get('token');
    }

    deleteCookies() {
        this.cookieService.delete('token', '/');
        this.cookieService.delete('currenUser', '/');
        this.cookieService.deleteAll();
    }

    httpCall(httpMethod = ``, api = ``, body = {}): any {
        try {
            httpMethod = httpMethod.toLowerCase();
            const url = this.SERVER_ADDRESS + api;
    
            if (httpMethod === `get`) {
                return this.http.get(url);
            } else if (httpMethod === `post`) {
                return this.http.post(url, body);
            } else if (httpMethod === `put`) {
                return this.http.put(url, body);
            } else if (httpMethod === `delete`) {
                return this.http.delete(url, body);
            }
        } catch (error) {
            console.error(error);
        }
    }

    httpAuthCall(httpMethod = ``, api = ``, body = {}): any {
        try {
            httpMethod = httpMethod.toLowerCase();
            const url = this.SERVER_ADDRESS + api;
            const token = this.getToken();
            var reqHeader = new HttpHeaders({ 
                'Authorization': 'Bearer ' + (token)
             });
    
            if (httpMethod === 'get') {
                return this.http.get(url, { headers: reqHeader });
            } else if (httpMethod === 'post') {
                return this.http.post(url, body, { headers: reqHeader });
            } else if (httpMethod === 'put') {
                return this.http.put(url, body, { headers: reqHeader });
            } else if (httpMethod == 'delete') {
                return this.http.delete(url, { headers: reqHeader });
            }
        } catch (error) {
            console.error(error);
            console.log("hi")
        }
    }

    httpPostImage(fileToUpload: any) {
        const url = this.SERVER_ADDRESS + `/user/image`;
        const token = this.getToken();
        var reqHeader = new HttpHeaders({ 
            'Authorization': 'Bearer ' + (token)
         });
        const formData: FormData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name);
        return this.http.post(url, formData, { headers: reqHeader });
    }

    markFormGroupTouched(formGroup: any) {
        if (formGroup.controls) {
            const keys = Object.keys(formGroup.controls);
            for (let i = 0; i < keys.length; i++) {
                const control = formGroup.controls[keys[i]];

                if (control instanceof FormControl) {
                    control.markAsTouched();
                } else if (control instanceof FormGroup) {
                    this.markFormGroupTouched(control);
                } else if (control instanceof FormArray) {
                    this.markFormGroupTouched(control);
                }
            }
        }
    }
}