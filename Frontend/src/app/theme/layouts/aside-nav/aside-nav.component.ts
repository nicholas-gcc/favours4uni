import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ACCESSIBILITY } from '../../../auth/accessibility';

@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    styleUrls: ['./aside-nav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AsideNavComponent implements OnInit, AfterViewInit {
    pages = [{
        "title": "",
        "path": "",
        "icon": "",
        "enabled": true,
        "subpage": []
    }];

    constructor() { }

    ngOnInit() {
        // to set differently when admin is implemented
        this.setDefaultSidebar();
    }

    setDefaultSidebar() {
        this.pages = ACCESSIBILITY;
    }

    ngAfterViewInit() {
    }

}
