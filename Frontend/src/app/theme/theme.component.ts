import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ThemeComponent implements OnInit {

  constructor(
    private _router: Router) { }

  ngOnInit(): void {
  }

}
