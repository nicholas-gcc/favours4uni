import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../_services/services.service';
import * as _ from 'lodash';

declare var $: any 
@Component({
  selector: 'app-dashboard',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MessageComponent implements OnInit, AfterViewInit {

  currentUser:any;
  msg = "";
  viewIndex = -1;

  msgHistory:any = [{
    time: "cs3219"
  }];

  defaultDp = "https://firebasestorage.googleapis.com/v0/b/favours4uni.appspot.com/o/generic-profile.png?alt=media&token=66cc9bd9-b1e3-420e-bfd9-e1516d1c3397";

  allChat:any = [];
  mostRecentActivity:any;
  once = true;
  createNewChat = false;

  username:any;

  constructor(
      private _router: Router,
      private _route: ActivatedRoute,
      private _services: ServicesService,
  ) {
    this._route.params.subscribe(params =>
      this.username = params['username']
    );
  }

  ngOnInit(): void {
    this.currentUser = this._services.getCurrentUser();
    this.getAllChats();
  }

  ngAfterViewInit():void {}

  getAllChats() {
    this._services.httpAuthCall(`get`, this._services.getAllChat(this.currentUser.username)).subscribe((response:any) => {
      if (this.once || response.chats[0].most_recent_activity != this.mostRecentActivity) {
        this.allChat = response.chats;
        if (this.username) {
          this.handleRouted();
        } else {
          this.formatResponse();
        }
      }
    }, (err:any) => {
      if (err.error.code == "auth/id-token-expired") {
        console.log(err)
        this._services.deleteCookies();
        this._router.navigate(['/login']);
      } else {
        this._router.navigate(['/dashboard']);
      }
    });
  }

  handleRouted() {
    const body = {
      receiver: this.username
    }

    this._services.httpAuthCall(`post`, this._services.postSingleChat(), body).subscribe((response:any) => {
      if (response.message == "Chat retrieved successfully" && response.body.messages.length != 0) {
        // chat exist
        this.msgHistory = response.body.messages
        const chatId = response.chatId;
        const index = _.findIndex(this.allChat, function(o:any) {
          return o.chatId == chatId;
        })
        this.viewIndex = index;
        this.formatResponse();
      } else if (response.message == "New chat created!" || response.body.messages.length == 0) {
        // new chat created
        const chatId = response.chatId;
        if (this.allChat) {
          this.allChat.unshift({
            chatId: chatId,
            messages: [],
            most_recent_activity: null,
            parties: [this.username]
          });
        } else {
          this.allChat = [{
            chatId: chatId,
            messages: [],
            most_recent_activity: null,
            parties: [this.username]
          }]
        }
        this.viewIndex = 0;
        this.createNewChat = true;
        this.removeParty();
      } else {
        this._router.navigate(['/message']);
      }
    }, (err:any) => {
      if (err.error.code == "auth/id-token-expired") {
        console.log(err)
        this._services.deleteCookies();
        this._router.navigate(['/login']);
      } else {
        this._router.navigate(['/dashboard']);
      }
    });
  }

  logout() {
    this.currentUser = null;
    this._services.deleteCookies();
    this._router.navigate(['/dashboard']);
  }

  onKeyMessage(event:any) {
    this.msg = event.target.value;
    if (event.code == "Enter") {
      this.onSend();
    }
  }

  onSend() {
    if (this.msg == "") return;
    this.msgHistory.unshift({
      message: this.msg,
      sender: this.currentUser.username,
      time: "sending"
    });
    const body = {
      message: this.msg
    }
    // handle if new guy (this.createNewChat)
    this._services.httpAuthCall(`put`, this._services.sendMessage(this.allChat[this.viewIndex].chatId), body).subscribe((response:any) => {
      this.getAllChats();
      this.viewIndex = 0;
    }, (err:any) => {
      this._router.navigate(['/login']);
    });
    this.msg = "";
  }

  formatResponse() {
    this.removeParty();
    if (this.viewIndex >= 0) {
      this.msgHistory = this.allChat[this.viewIndex].messages;
    }
    this.mostRecentActivity = this.allChat[0].most_recent_activity;
    if (this.once) {
      this.once = false;
      var refreshie = setInterval(() => {
        console.log("called")
        const url = this._router.url.slice(0,8)
        if (!this.currentUser || url != "/message") {
          clearInterval(refreshie);
        }
        this.getAllChats();
      }, 2000);
    }
  }

  removeParty() {
    let that = this;
    for (let i = 0; i < this.allChat.length; i++) {
      _.remove(this.allChat[i].parties, function(n) {
        return n == that.currentUser.username;
      })
      this._services.httpCall(`get`, this._services.getImageUrl(this.allChat[i].parties[0])).subscribe((response:any) => {
        if (response.imageUrl || response?.Url == "") {
          this.allChat[i].url = response.imageUrl;
        } else {
          this.allChat[i].url = this.defaultDp;
        }
      })
    }
  }

  onClickChat(i:number) {
    this.msg = '';
    this.viewIndex = i;
    if (this.createNewChat) {
      // this._router.navigate(['/message']);
      this.username = null;
      this.createNewChat = false;
      this.getAllChats();
      this.viewIndex--;
    }
    this.msgHistory = this.allChat[i].messages;
  }
}
