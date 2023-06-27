import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'favours-for-uni';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private titleService: Title) {
  }

  ngOnInit() {
  }

  getChild(activatedRoute: ActivatedRoute):ActivatedRoute {  
    if (activatedRoute.firstChild) {  
        return this.getChild(activatedRoute.firstChild);  
    } else {  
        return activatedRoute;  
    }
  }  
}
