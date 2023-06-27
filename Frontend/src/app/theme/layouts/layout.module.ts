import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { DefaultComponent } from '../pages/default.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';


@NgModule({
    declarations: [
        LayoutComponent,
        DefaultComponent,
        AsideNavComponent
    ],
    exports: [
        LayoutComponent,
        AsideNavComponent,
        DefaultComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule
    ]
})
export class LayoutModule {
}