import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { MatCardModule } from '@angular/material/card';

import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                data: { title: 'Dashboard' },
                component: DashboardComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule
    ], exports: [
        RouterModule
    ], declarations: [
        DashboardComponent
    ], providers: [
        CurrencyPipe
    ]
})
export class DashboardModule {

}