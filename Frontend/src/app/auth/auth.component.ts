import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ServicesService } from '../_services/services.service';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './auth.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
    backlottie: AnimationOptions = {
        path: '/assets/13170-back-arrow.json',
    };

    heartlottie: AnimationOptions = {
        path: '/assets/lf30_editor_avibfk7k.json',
    };

    credentials = {
        email: "",
        password: ""
    }

    hasValidationError = false;
    isLoading = false;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _services: ServicesService,
        private cfr: ComponentFactoryResolver
        )
        {  }
    
        ngOnInit() {
    }
        
    onKeyEmail(event:any) {
        this.credentials.email = event.target.value;
    }

    onKeyPassword(event:any) {
        this.credentials.password = event.target.value;
    }

    login() {
        this.isLoading = true;
        this.hasValidationError = false;
        this._services.httpCall(`post`, this._services.login(), this.credentials).subscribe((response:any) => {
            let token = response.token;
            delete response.token;
            
            if (token) {
                this._services.deleteCookies();
                this._services.setToken(token);
                this._services.setCurrentUser(token);
                setTimeout(() => {
                    this.isLoading = false;
                    this._router.navigate(['/dashboard']);
                }, 1000);
            }
        }, (err: any) => {
            this.isLoading = false;
            console.log(err);
            this.hasValidationError = true;
        });
    }

}