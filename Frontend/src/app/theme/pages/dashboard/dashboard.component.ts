import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServicesService } from '../../../_services/services.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {

  isLoggedIn = false;
  isModalShown = false;
  isModalCasual = true;
  isRequesting = 'view';
  reqMessage = '';
  sortPosted = true;

  casualFavours:any = [];
  professionalFavours: any = [];

  currentUser:any = null;

  viewPage = 0;
  hasNextPage = true;
  hasPreviousPage = false;

  viewProPage = 0;
  hasNextProPage = true;
  hasPreviousProPage = false;
  
  emptyDisplayData = [{
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: ''
  }, {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: ''
  }, {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: ''
  }, 
  {
    title: '',
    body: '',
    isUrgent: '',
    location: '',
    poster: '',
    timePosted: '',
    postedAgo: '',
    deadline: '',
    deadlineLeft: '',
    favourId: ''
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
    url: ''
  }

  defaultDp = "https://firebasestorage.googleapis.com/v0/b/favours4uni.appspot.com/o/generic-profile.png?alt=media&token=66cc9bd9-b1e3-420e-bfd9-e1516d1c3397";

  // Deep clone
  displayData = JSON.parse(JSON.stringify(this.emptyDisplayData));
  displayProData = JSON.parse(JSON.stringify(this.emptyDisplayData));

  displayModal = JSON.parse(JSON.stringify(this.emptyModalDisplayData));

  constructor(
    private _services: ServicesService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getFavours();

    if (this._services.getToken()) {
      this.currentUser = this._services.getCurrentUser();
    }
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
  }
      
  ngAfterViewInit() {
  }

  getFavours() {
    if (this.sortPosted) {
      this._services.httpCall(`get`, this._services.getAllCasualFavours()).subscribe((response:any) => {
        this.casualFavours = response;
        this.setCasualData();
      })
      this._services.httpCall(`get`, this._services.getAllProfessionalFavours()).subscribe((response:any) => {
        this.professionalFavours = response;
        this.setProfessionalData();
      })
    } else {
      this._services.httpCall(`get`, this._services.getAllCasualFavoursSort()).subscribe((response:any) => {
        this.casualFavours = response;
        this.setCasualData();
      })
      this._services.httpCall(`get`, this._services.getAllProfessionalFavoursSort()).subscribe((response:any) => {
        this.professionalFavours = response;
        this.setProfessionalData();
      })
    }
  }

  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this._services.deleteCookies();
  }

  openModal(number: any) {
    this.isModalShown = true;
    this.displayModal = JSON.parse(JSON.stringify(this.emptyModalDisplayData));



    if (number < 4) {
    this.isModalCasual = true;
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
    } else {
    number -= 4;
    this.isModalCasual = false;
    this.displayModal.title = this.displayProData[number].title;
    this.displayModal.body = this.displayProData[number].body;
    this.displayModal.isUrgent = this.displayProData[number].isUrgent;
    this.displayModal.location = this.displayProData[number].location;
    this.displayModal.poster = this.displayProData[number].poster;
    this.displayModal.timePosted = this.displayProData[number].timePosted;
    this.displayModal.postedAgo = this.displayProData[number].postedAgo;
    this.displayModal.deadline = this.convertDeadline(this.displayProData[number].deadline);
    this.displayModal.deadlineLeft = this.displayProData[number].deadlineLeft;
    this.displayModal.favourId = this.displayProData[number].favourId;
    }

    this._services.httpCall(`get`, this._services.getImageUrl(this.displayModal.poster)).subscribe((response:any) => {
      if (response.imageUrl || response?.Url == "") {
        this.displayModal.url = response.imageUrl;
      } else {
        this.displayModal.url = this.defaultDp;
      }
    })

    if (this.isLoggedIn) {
      this._services.httpAuthCall(`get`, this._services.getSingleFavour(this.displayModal.favourId)).subscribe((response:any) => {
        if (response.requestStatus) {
          if (response.requestStatus == -1) {
            this.isRequesting = 'requested';
          } else if (response.requestStatus == 0) {
            this.isRequesting = 'rejected';
          } else if (response.requestStatus == 1) {
            this.isRequesting = 'accepted';
          }
        } else {
          this.isRequesting = 'view';
        }
      });
    } else {
      this.isRequesting = 'view';
    }
    $('#cardDetailsModal').modal('show');
  }

  sort() {
    this.viewPage = 0;
    this.viewProPage = 0;
    this.sortPosted = !this.sortPosted;
    this.getFavours();
  }

  convertDeadline(deadline:String) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date:any = parseInt(deadline.slice(3, 5));
    let month = months[parseInt(deadline.slice(6, 8)) - 1];
    let year = deadline.slice(9, 11);
    let time = this.timeConvert(deadline.slice(-5));

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
    }, (err:any) => {
      this._services.deleteCookies();
      this._router.navigate(['/login']);
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
  
  setCasualData() {
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
      this.displayData[i].location = this.casualFavours[j].location;
      this.displayData[i].poster = this.casualFavours[j].poster;
      this.displayData[i].favourId = this.casualFavours[j].favour_id;

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
      
      let deadline = "By " + date + "/" + month + "/" + String(deadlineDate.getFullYear()).slice(2, 4) + ", " + deadlineDate.toTimeString().slice(0, 5);
      
      let postDateNum = this.casualFavours[j].timestamp_posted._seconds*1000;
      let postDate = new Date(postDateNum);
      let nowDateNum = Date.now();
      let nowDate = new Date(nowDateNum);
      let postAgo = "Posted " + this.msToTime(nowDateNum - postDateNum) + " ago";

      let timeLeft = this.msToTime(deadlineDateNum - nowDateNum) + " left";
      
      
      this.displayData[i].timePosted = postDate;
      this.displayData[i].postedAgo = postAgo;
      this.displayData[i].deadline = deadline;
      this.displayData[i].deadlineLeft = timeLeft;
    }
  }

  casualNextPage() {
    this.viewPage +=4;
    // assert
    if (this.viewPage > this.casualFavours.length) {
      this.viewPage = this.casualFavours.length;
    }
    this.setCasualData();
  }

  casualPreviousPage() {
    this.viewPage -=4;
    // assert
    if (this.viewPage < 0) {
      this.viewPage = 0;
    }
    this.setCasualData();
  }

  setProfessionalData() {
    this.displayProData = JSON.parse(JSON.stringify(this.emptyDisplayData));

    this.hasNextProPage = this.viewProPage + 4 < this.professionalFavours.length;
    this.hasPreviousProPage = this.viewProPage > 0;

    for (let i = 0; i < 4; i++) {
      let j = this.viewProPage + i;

      if (!this.professionalFavours[j]) {
        break;
      }
      this.displayProData[i].title = this.professionalFavours[j].title;
      this.displayProData[i].body = this.professionalFavours[j].body;
      this.displayProData[i].isUrgent = this.professionalFavours[j].urgent? 'URGENT' : 'NOT URGENT';
      this.displayProData[i].location = this.professionalFavours[j].location;
      this.displayProData[i].poster = this.professionalFavours[j].poster;
      this.displayProData[i].favourId = this.professionalFavours[j].favour_id;

      let deadlineDateNum = Date.parse(this.professionalFavours[j].timestamp_due);
      let deadlineDate = new Date(deadlineDateNum);
      let month = deadlineDate.getMonth() + 1;
      let deadline = "By " + deadlineDate.getDate() + "/" + month + "/" + String(deadlineDate.getFullYear()).slice(2, 4) + ", " + deadlineDate.toTimeString().slice(0, 5);
      
      let postDateNum = this.professionalFavours[j].timestamp_posted._seconds*1000;
      let postDate = new Date(postDateNum);
      let nowDateNum = Date.now();
      let nowDate = new Date(nowDateNum);
      let postAgo = "Posted " + this.msToTime(nowDateNum - postDateNum) + " ago";

      let timeLeft = this.msToTime(deadlineDateNum - nowDateNum) + " left";

      this.displayProData[i].timePosted = postDate;
      this.displayProData[i].postedAgo = postAgo;
      this.displayProData[i].deadline = deadline;
      this.displayProData[i].deadlineLeft = timeLeft;
    }
  }

  proNextPage() {
    this.viewProPage +=4;
    // assert
    if (this.viewProPage > this.professionalFavours.length) {
      this.viewProPage = this.professionalFavours.length;
    }
    this.setProfessionalData();
  }

  proPreviousProPage() {
    this.viewProPage -=4;
    // assert
    if (this.viewProPage < 0) {
      this.viewProPage = 0;
    }
    this.setProfessionalData();
  }

  onRouteMsg() {
    $('#cardDetailsModal').modal('hide');
    if (this.displayModal.poster = this.currentUser.username) {
      this._router.navigate(['/message']);
    } else {
      this._router.navigate(['/message', this.displayModal.poster]);
    }
  }

  onRouteProfile() {
    $('#cardDetailsModal').modal('hide');
    this._router.navigate(['/profile', this.displayModal.poster]);
  }
}
