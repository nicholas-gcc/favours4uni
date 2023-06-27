import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
// import { LoginGuard } from './_guards';

import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return import('lottie-web');
}

import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [
        AuthComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        MatTabsModule,
        LottieModule.forRoot({ player: playerFactory})
    ],
    providers: [
    ]
})

export class AuthModule {
}