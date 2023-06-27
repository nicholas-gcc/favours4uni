import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ServicesService } from '../../_services/services.service';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './register.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
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

    signupForm: FormGroup = new FormGroup({});
    isPasswordSame = true;
    emailInUse = false;
    usernameInUse = false;
    sthWentWrong = false;
    isLoading = false;

    constructor(
        private _router: Router,
        private _services: ServicesService,
        private _route: ActivatedRoute,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'firstname': new FormControl(null, [Validators.required]),
            'lastname': new FormControl(null, [Validators.required]),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'phonenumber': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
            'repassword': new FormControl('', 
            [Validators.required, this.validateAreEqual.bind(this)]
            ),
            'username': new FormControl(null, [Validators.required, Validators.minLength(8)]),
            'telehandle': new FormControl(null, [Validators.required]),
            'bio': new FormControl(null)
        });
    }

    private validateAreEqual(fieldControl: FormControl) {
        this.isPasswordSame = fieldControl.value === this.signupForm.get("password")?.value
        return fieldControl.value === this.signupForm.get("password")?.value ? null : {
            NotEqual: true
        };
    }

    onEmailClick() {
        this.emailInUse = false;
    }

    onUsernameClick() {
        this.usernameInUse = false;
    }
        
    onSubmit() {
        this.emailInUse = false;
        this.usernameInUse = false;
        this.sthWentWrong = false;

        if (this.signupForm.status == 'INVALID') {
            this._services.markFormGroupTouched(this.signupForm);
            return;
        };

        let data = {
            "firstName": this.signupForm.value.firstname,
            "lastName": this.signupForm.value.lastname,
            "email": this.signupForm.value.email,
            "phoneNumber": String(this.signupForm.value.phonenumber),
            "password": this.signupForm.value.password,
            "username": this.signupForm.value.username,
            "telegramHandle": this.signupForm.value.telehandle,
            "bio": this.signupForm.value.bio
        };

        this.isLoading = true;
        this._services.httpCall(`post`, this._services.signup(), data).subscribe((response:any) => {
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
            this.isLoading = false;
        }, (err: any) => {
            this.isLoading = false;
            console.log(err);
            if (err.error.username) {
                this.usernameInUse = true;
            } else if (err.error.email) {
                this.emailInUse = true;
            } else {
                this.sthWentWrong = true;
            }
        });

        // this.signupForm.reset();
    }
    
}