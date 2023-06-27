import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../../_services/services.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  isLoggedIn = false;
  isThisMonth = true;

  currentUser:any = null;

  topCasual = [[0, "", ""], [0, "", ""], [0, "", ""], [0, "", ""]];
  topProfessional = [[0, "", ""], [0, "", ""], [0, "", ""], [0, "", ""]];
  genetricProfilePicUrl = "https://firebasestorage.googleapis.com/v0/b/favours4uni.appspot.com/o/generic-profile.png?alt=media&token=66cc9bd9-b1e3-420e-bfd9-e1516d1c3397";

  constructor(
    private _services: ServicesService,
    private _router: Router
    ) {
  }

  ngOnInit(): void {
    this._services.httpCall(`get`, this._services.getTopFourCasualMonth()).subscribe((response:any) => {
      this.topCasual = response;
    })
    this._services.httpCall(`get`, this._services.getTopFourProfessionalMonth()).subscribe((response:any) => {
      this.topProfessional = response;
    })

    this.currentUser = this._services.getCurrentUser();
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
  }

  clickProfile() {
  }

  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this._services.deleteCookies();
  }

  onBadgeClick(date: string) {
    this.isThisMonth = date == 'month';
    this.topCasual = [[0, "", ""], [0, "", ""], [0, "", ""], [0, "", ""]];
    this.topProfessional = [[0, "", ""], [0, "", ""], [0, "", ""], [0, "", ""]];
    if (this.isThisMonth) {
      this._services.httpCall(`get`, this._services.getTopFourCasualMonth()).subscribe((response:any) => {
        this.topCasual = response;
      })
      this._services.httpCall(`get`, this._services.getTopFourProfessionalMonth()).subscribe((response:any) => {
        this.topProfessional = response;
      })
    } else {
      this._services.httpCall(`get`, this._services.getTopFourCasual()).subscribe((response:any) => {
        this.topCasual = response;
      })
      this._services.httpCall(`get`, this._services.getTopFourProfessional()).subscribe((response:any) => {
        this.topProfessional = response;
      })
    }
  }
  onCardClick(num:number) {
    let username:any = "";
    if (num < 4) {
      username = this.topCasual[num][1];
    } else {
      num -= 4;
      username = this.topProfessional[num][1];
    }
    if (this.isLoggedIn) {
      this._router.navigate(['/profile', username]);
    }
  }

}
