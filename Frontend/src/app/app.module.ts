import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from './theme/layouts/layout.module';
import { ServicesModule } from './_services/_services.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeComponent } from './theme/theme.component';
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { LottieModule } from 'ngx-lottie';
import { CookieService } from 'ngx-cookie-service';

export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    ThemeComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    FormsModule,
    ThemeRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCardModule,
    ServicesModule,
    LottieModule.forRoot({ player: playerFactory})
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
