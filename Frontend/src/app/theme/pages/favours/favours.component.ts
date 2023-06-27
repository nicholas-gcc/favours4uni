import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ServicesService } from '../../../_services/services.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

declare var $: any 
@Component({
  selector: 'app-favours',
  templateUrl: './favours.component.html',
  styleUrls: ['./favours.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FavoursComponent implements OnInit, AfterViewInit {

  isLoggedIn = false;
  isModalShown = false;
  isModalCasual = true;
  isRequesting = 'view';
  reqMessage = '';

  casualAll:any = [];
  professionalAll:any = [];
  casualFavours:any = [];

  currentUser:any = null;

  viewPage = 0;
  hasNextPage = true;
  hasPreviousPage = false;

  isPosted = true;
  isPast = false;
  isHelping = false;
  isFulfilled = false;

  emptyDisplayData = [{
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    category: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: '',
    requestors: [],
    index: -1
  }, {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    category: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: '',
    requestors: [],
    index: -1
  }, {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    category: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: '',
    requestors: [],
    index: -1
  }, 
  {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    category: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: '',
    requestors: [],
    index: -1
  }];
  
  emptyModalDisplayData = {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: '',
    url: '',
    requestors: [],
    index: -1
  }

  defaultDp = "https://firebasestorage.googleapis.com/v0/b/favours4uni.appspot.com/o/generic-profile.png?alt=media&token=66cc9bd9-b1e3-420e-bfd9-e1516d1c3397";
  newFavourForm: FormGroup = new FormGroup({});
  isNewFavourCasual = true;
  isNewFavourUrgent = false;
  minDate: Date = new Date();
  date = String(this.minDate);
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  time = "";

  // Deep clone
  displayData = JSON.parse(JSON.stringify(this.emptyDisplayData));
  displayModal = JSON.parse(JSON.stringify(this.emptyModalDisplayData));

  constructor(
    private _services: ServicesService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this._services.getCurrentUser();
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
    this.loadPostedFavours();

    this.initForm();
  }

  ngAfterViewInit() {}
  
  loadPostedFavours() {
    this.viewPage = 0;
    this.isPosted = true;
    this.isPast = false;
    this.isHelping = false;
    this.isFulfilled = false;
    this._services.httpAuthCall(`get`, this._services.getAllNonExpiredFavours(this.currentUser.username)).subscribe((response:any) => {
      if (response != "This user does not have any non-expired favours") {
        this.casualFavours = response.favours;
        this.setData();
      } else {
        this.casualFavours = [];
        this.setData();
      }
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  loadPastFavours() {
    this.viewPage = 0;
    this.isPosted = false;
    this.isPast = true;
    this.isHelping = false;
    this.isFulfilled = false;
    this._services.httpAuthCall(`get`, this._services.getAllPastFavours(this.currentUser.username)).subscribe((response:any) => {
      if (response != "This user does not have any past favours") {
        this.casualFavours = response.favours;
        this.setData();
      } else {
        this.casualFavours = [];
        this.setData();
      }
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  loadInProgressFavours() {
    this.viewPage = 0;
    this.isPosted = false;
    this.isPast = false;
    this.isHelping = true;
    this.isFulfilled = false;
    this._services.httpAuthCall(`get`, this._services.getAllInProgressFavours(this.currentUser.username)).subscribe((response:any) => {
      if (response != "This user does not have any in-progress favours") {
        this.casualFavours = response.favours;
        this.setData();
      } else {
        this.casualFavours = [];
        this.setData();
      }
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  loadFulfilledFavours() {
    this.viewPage = 0;
    this.isPosted = false;
    this.isPast = false;
    this.isHelping = false;
    this.isFulfilled = true;
    this._services.httpAuthCall(`get`, this._services.getAllFavoursCompletedByUser(this.currentUser.username)).subscribe((response:any) => {
      if (response != "This user has not completed any favours") {
        this.casualFavours = response.favours;
        this.setData();
      } else {
        this.casualFavours = [];
        this.setData();
      }
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  
      
  
  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this._services.deleteCookies();
  }

  openModal(number: any) {
    this.isModalShown = true;
    this.displayModal = JSON.parse(JSON.stringify(this.emptyModalDisplayData));

    this.isModalCasual = this.displayData[number].category == 'Casual';
    this.displayModal.title = this.displayData[number].title;
    this.displayModal.body = this.displayData[number].body;
    this.displayModal.isUrgent = this.displayData[number].isUrgent;
    this.displayModal.location = this.displayData[number].location;
    this.displayModal.poster = this.displayData[number].poster;
    this.displayModal.timePosted = this.displayData[number].timePosted;
    this.displayModal.postedAgo = this.displayData[number].postedAgo;
    this.displayModal.deadline = this.convertDeadline(this.displayData[number].deadline);
    this.displayModal.deadlineLeft = this.displayData[number].deadlineLeft;
    this.displayModal.favourId = this.displayData[number].favourId;
    this.displayModal.requestors = this.displayData[number].requestors;

    if (this.isPosted) {
      this.displayModal.index = this.isInProgress(this.displayModal.requestors);
      $('#postedModal').modal('show');
    } else if (this.isPast) {
      this.displayModal.index = this.displayData[number].index;
      this._services.httpCall(`get`, this._services.getImageUrl(this.displayModal.index)).subscribe((response:any) => {
        if (response.imageUrl || response?.Url == "") {
          this.displayModal.url = response.imageUrl;
        } else {
          this.displayModal.url = this.defaultDp;
        }
      })
      $('#pastModal').modal('show');
    } else if (this.isHelping) {
      this._services.httpCall(`get`, this._services.getImageUrl(this.displayModal.poster)).subscribe((response:any) => {
        if (response.imageUrl || response?.Url == "") {
          this.displayModal.url = response.imageUrl;
        } else {
          this.displayModal.url = this.defaultDp;
        }
      })
      $('#helpingModal').modal('show');
    } else if (this.isFulfilled) {
      this._services.httpCall(`get`, this._services.getImageUrl(this.displayModal.poster)).subscribe((response:any) => {
        if (response.imageUrl || response?.Url == "") {
          this.displayModal.url = response.imageUrl;
        } else {
          this.displayModal.url = this.defaultDp;
        }
      })
      $('#fulfilledModal').modal('show');
    } else {
      $('#cardDetailsModal').modal('show');
    }
  }

  isInProgress(arr:Array<any>):number {
    return _.findIndex(arr, function(o) { return o.isAccepted == 1; });
  }

  routeRequestor(requestor:string) {
    if (this.isPosted) {
      $('#postedModal').modal('hide');
    } else  if (this.isPast) {
      $('#pastModal').modal('hide');
    }
    this._router.navigate(['/profile', requestor]);
  }

  onAcceptRequestor(index:number) {
    $('#postedModal').modal('hide');
    let body = {
      requestor_username: this.displayModal.requestors[index].username
    }
    this._services.httpAuthCall(`put`, this._services.acceptRequest(this.displayModal.favourId), body).subscribe((response:any) => {
      this.ngOnInit();
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  onRejectRequestor(index:number) {
    $('#postedModal').modal('hide');
    let body = {
      requestor_username: this.displayModal.requestors[index].username
    }
    this._services.httpAuthCall(`put`, this._services.rejectRequest(this.displayModal.favourId), body).subscribe((response:any) => {
      this.ngOnInit();
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }

  onMarkAsCompleted(username:string) {
    $('#postedModal').modal('hide');
    const body = {
      "completedBy": username
    }
    this._services.httpAuthCall(`put`, this._services.setCompletedBy(this.displayModal.favourId), body).subscribe((response:any) => {
      this.loadPastFavours();
    }, (err: any) => {
      console.log(err);
      this._router.navigate(['/login']);
    })
  }
 
  initForm() {
    this.newFavourForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'body': new FormControl(null, [Validators.required]),
      'location': new FormControl(null, [Validators.required]),
    });
  }

  addFavour() {
    $('#addFavourModal').modal('show');
  }

  onCasualClick() {
    this.isNewFavourCasual = true;
  }

  onProClick() {
    this.isNewFavourCasual = false;
  }

  onUrgentClick() {
    this.isNewFavourUrgent = true;
  }

  onNotUrgentClick() {
    this.isNewFavourUrgent = false;
  }

  onDateChange(event:any) {
    this.date = event.target.value;
  }

  onKeyTime(event:any) {
    this.time = event.target.value;
  }

  onDeleteFavour() {
    $('#postedModal').modal('hide');

    this._services.httpAuthCall(`delete`, this._services.deleteFavour(this.displayModal.favourId)).subscribe((response:any) => {
      console.log(response)
      this.ngOnInit();
    }, (err: any) => {
      console.log(err);
      // this._services.deleteCookies();
      this._router.navigate(['/login']);
    })
  }

  formatDate(date: any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  onSubmit() {
    
    if (this.newFavourForm.status == 'INVALID') {
      this._services.markFormGroupTouched(this.newFavourForm);
      return;
    };

    let formattedDate = this.formatDate(this.date) + "T" + $('#input').val();
    let data = {
        "title": this.newFavourForm.value.title,
        "body": this.newFavourForm.value.body,
        "location": this.newFavourForm.value.location,
        "category": this.isNewFavourCasual? 'Casual' : 'Professional',
        "urgent": this.isNewFavourUrgent,
        "timestamp_due": formattedDate
    };

    this._services.httpAuthCall(`post`, this._services.postSingleFavour(), data).subscribe((response:any) => {
      $('#addFavourModal').modal('hide');
      this.ngOnInit();
    }, (err:any) => {
      $('#addFavourModal').modal('hide');
      this._services.deleteCookies();
      this._router.navigate(['/login']);
    });

  }

  convertDeadline(deadline:String) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date:any = parseInt(deadline.slice(3, 5));
    let month = months[parseInt(deadline.slice(6, 8)) - 1];
    let year = deadline.slice(9, 13);
    let time = this.timeConvert(deadline.slice(-11, -6) + deadline.slice(-2));

    if (date == 1) {
      date = date + "st";
    } else if (date == 2) {
      date = date + "nd";
    } else if (date == 3) {
      date = date + "rd";
    } else {
      date = date + "th";
    }

    return date + " " + month + " " + year + " - " + time;
  }

  onRequest() {
    this.isRequesting = 'request';
  }

  onCancel() {
    this.isRequesting = 'view';
  }

  onKeyMessage(event:any) {
    this.reqMessage = event.target.value;
  }

  onSend() {
    let body = {
      message: this.reqMessage
    }
    this._services.httpAuthCall(`put`, this._services.makeRequestToFavour(this.displayModal.favourId), body).subscribe((response:any) => {
      this.isRequesting = 'requested';
      });
  }

  msToTime(ms:any) {
    let seconds:any = (ms / 1000).toFixed(1);
    let minutes:any = (ms / (1000 * 60)).toFixed(1);
    let hours:any = (ms / (1000 * 60 * 60)).toFixed(1);
    let days:any = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
      return Math.floor(seconds) + " seconds";
    } else if (minutes < 60) {
      if (Math.floor(minutes) <= 1) {
        return Math.floor(minutes) + " minute";
      } else {
        return Math.floor(minutes) + " minutes";
      }
    } else if (hours < 24) {
      if (Math.floor(hours) <= 1) {
        return Math.floor(hours) + " hour";
      } else {
        return Math.floor(hours) + " hours";
      }
    } else {
      if (Math.floor(days) <= 1) {
        return Math.floor(days) + " day"
      } else {
        return Math.floor(days) + " days"
      }
    }
  }

  timeConvert(time:any) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
  setData() {
    this.displayData = JSON.parse(JSON.stringify(this.emptyDisplayData));

    this.hasNextPage = this.viewPage + 4 < this.casualFavours.length;
    this.hasPreviousPage = this.viewPage > 0;

    for (let i = 0; i < 4; i++) {
      let j = this.viewPage + i;

      if (!this.casualFavours[j]) {
        break;
      }
      this.displayData[i].title = this.casualFavours[j].title;
      this.displayData[i].body = this.casualFavours[j].body;
      this.displayData[i].isUrgent = this.casualFavours[j].urgent? 'URGENT' : 'NOT URGENT';
      this.displayData[i].category = this.casualFavours[j].category;
      this.displayData[i].location = this.casualFavours[j].location;
      this.displayData[i].poster = this.casualFavours[j].poster;
      this.displayData[i].favourId = this.casualFavours[j].favour_id;
      this.displayData[i].requestors = this.casualFavours[j].requestors

      let deadlineDateNum = Date.parse(this.casualFavours[j].timestamp_due);
      let deadlineDate = new Date(deadlineDateNum);
      let month: any = deadlineDate.getMonth() + 1;
      let date: any = '';
      if (deadlineDate.getDate() < 10) {
        date = "0" + deadlineDate.getDate();
      } else {
        date = deadlineDate.getDate();
      }

      if (month < 10) {
        month = "0" + month;
      }

      // mm/dd/yyyy
      let deadlined = this.casualFavours[j].timestamp_due.slice(0,10);
      let numDays = this.datediff(new Date(), this.parseDate(deadlined))
      
      let deadline = "By " + this.casualFavours[j].timestamp_due;
      
      let postDateNum = this.casualFavours[j].timestamp_posted._seconds*1000;
      let postDate = new Date(postDateNum);
      let nowDateNum = Date.now();
      let nowDate = new Date(nowDateNum);
      let postAgo = "Posted on " + this.casualFavours[j].timestamp_posted;

      let timeLeft = this.msToTime(deadlineDateNum - nowDateNum) + " left";
      
      
      this.displayData[i].timePosted = postDate;
      this.displayData[i].postedAgo = postAgo;
      this.displayData[i].deadline = deadline;
      this.displayData[i].deadlineLeft = numDays;

      if (this.isPosted) {
        this.displayData[i].index = this.isInProgress(this.casualFavours[j].requestors);
      } else if (this.isPast) {
        this.displayData[i].index = this.casualFavours[j].completedBy;
      }

    }
  }

  parseDate(str: any) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
  }

  datediff(first:any, second:any) {
    return Math.round((second-first)/(1000*60*60*24));
  }

  casualNextPage() {
    this.viewPage +=4;
    // assert
    if (this.viewPage > this.casualFavours.length) {
      this.viewPage = this.casualFavours.length;
    }
    this.setData();
  }

  casualPreviousPage() {
    this.viewPage -=4;
    // assert
    if (this.viewPage < 0) {
      this.viewPage = 0;
    }
    this.setData();
  }

  onRouteMsg() {
    $('#cardDetailsModal').modal('hide');
    this._router.navigate(['/message', this.displayModal.poster]);
  }
}