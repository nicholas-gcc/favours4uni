import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';

import { LeaderboardComponent } from './leaderboard.component';


const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                data: { title: 'Leaderboard' },
                component: LeaderboardComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ], exports: [
        RouterModule
    ], declarations: [
        LeaderboardComponent
    ], providers: [
        CurrencyPipe
    ]
})
export class LeaderboardModule {

}