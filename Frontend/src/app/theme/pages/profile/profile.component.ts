import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ServicesService } from '../../../_services/services.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, AfterViewInit {

  currentUser:any = null;
  curr:any = null;

  emptyUserData = {
    bio: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    telegramHandle: ''
  }

  userData = JSON.parse(JSON.stringify(this.emptyUserData));

  signupForm: FormGroup = new FormGroup({});
  emailInUse = false;
  usernameInUse = false;
  sthWentWrong = false;
  isLoading = false;
  isViewingSelf = false;

  username:any;
  isViewOthers = false;
  othersDetails:any;
  othersCompletedFavour: any = [];

  defaultDp = "https://firebasestorage.googleapis.com/v0/b/favours4uni.appspot.com/o/generic-profile.png?alt=media&token=66cc9bd9-b1e3-420e-bfd9-e1516d1c3397";

  fileToUpload: File | null = null;

  constructor(
    private _services: ServicesService,
    private _router: Router,
    private _route: ActivatedRoute
    ) {    
      this._route.params.subscribe(params =>
        this.username = params['username']
      );
  }

  ngOnInit() {
    let token = this._services.getToken();
    this.curr = this._services.getCurrentUser();
    if (this.username) {
      this.isViewOthers = true;
      this.isViewingSelf = this.username == this.curr.username;
    }

    if (token && !this.isViewOthers) {
      this.loadUserData();
      this.signupForm = new FormGroup({
        'firstname': new FormControl(null, [Validators.required]),
        'lastname': new FormControl(null, [Validators.required]),
        'email': new FormControl({value: null, disabled: true}, [Validators.required, Validators.email]),
        'phonenumber': new FormControl(null, [Validators.required]),
        'username': new FormControl({value: null, disabled: true}, [Validators.required, Validators.minLength(8)]),
        'telehandle': new FormControl(null, [Validators.required]),
        'bio': new FormControl(null)
      });
    } else if (token && this.isViewOthers) {
      this.getOthersProfile();
    } else {
      this._router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
  }

  onClickPic() {
    $('#file').trigger('click'); 
  }

  onEmailClick() {
    this.emailInUse = false;
  }

  onUsernameClick() {
      this.usernameInUse = false;
  }

  onMessage() {
    if (this.username) {
      this._router.navigate(['/message', this.username]);
    }
  }

  handleFileInput(e: any) {
    this.fileToUpload = e.target.files[0];
    this._services.httpPostImage(this.fileToUpload).subscribe((response) => {
      window.location.reload()
      // this.ngOnInit();
    });
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
          "phoneNumber": String(this.signupForm.value.phonenumber),
          "telegramHandle": this.signupForm.value.telehandle,
          "bio": this.signupForm.value.bio
      };

      this.isLoading = true;
      this._services.httpAuthCall(`post`, this._services.updateUserDetails(), data).subscribe((response:any) => {
          this.isLoading = false;
          this.ngOnInit();
      }, (err: any) => {
          console.log(err)
          this.isLoading = false;
          if (err.error.username) {
              this.usernameInUse = true;
          } else if (err.error.email) {
              this.emailInUse = true;
          } else {
              this.sthWentWrong = true;
              this._services.deleteCookies();
              this._router.navigate(['/login']);
          }
      });
      // this.signupForm.reset();
  }

  loadUserData() {
    this._services.httpAuthCall(`get`, this._services.getUserDetails()).subscribe((response:any) => {
      let data = response.userCredentials;
      this.userData = data;
      this.currentUser = data;
      this.curr.imageUrl = data.imageUrl;
      this.signupForm.setValue({
        'firstname': data?.firstName,
        'lastname': data?.lastName,
        'email': data?.email,
        'phonenumber': data?.phoneNumber,
        'username': data?.username,
        'telehandle': data?.telegram,
        'bio': data?.bio
      });
      }, (err:any) => {
        if (err.error.code == "auth/id-token-expired") {
          console.log(err)
          this._services.deleteCookies();
          this._router.navigate(['/login']);
        } else {
          this._router.navigate(['/dashboard']);
        }
      }
    );
  }

  getOthersProfile() {
    this._services.httpAuthCall(`get`, this._services.getOtherUserDetails(this.username)).subscribe((response:any) => {
      this.othersDetails = response;
    }, (err:any) => {
      this._services.deleteCookies();
      this._router.navigate(['/login']);
    });

    this._services.httpAuthCall(`get`, this._services.getFavoursCompletedByUser(this.username)).subscribe((response:any) => {
      if (response.favours) {
        this.othersCompletedFavour = response.favours;
      } else {
        this.othersCompletedFavour = [];
      }
    });
  }

  logout() {
    this.currentUser = null;
    this._services.deleteCookies();
    this._router.navigate(['/dashboard']);
  }

}
