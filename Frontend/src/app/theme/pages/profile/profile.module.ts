import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';

import { ProfileComponent } from './profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileGuard } from './profile.guard';


const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                data: { title: 'Profile' },
                component: ProfileComponent,
                canActivate: [ProfileGuard]
            },
            {
                path: ":username",
                data: { title: 'Profile' },
                component: ProfileComponent,
                canActivate: [ProfileGuard]
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        MatGridListModule,
        MatTabsModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
    ], exports: [
        RouterModule
    ], declarations: [
        ProfileComponent
    ], providers: [
        CurrencyPipe,
        ProfileGuard
    ]
})
export class ProfileModule {

}