import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../default.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message.component';
import { MessageGuard } from './message.guard';


const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                data: { title: 'Message' },
                component: MessageComponent,
                canActivate: [MessageGuard]
            },
            {
                path: ":username",
                data: { title: 'Message' },
                component: MessageComponent,
                canActivate: [MessageGuard]
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        FormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        MessageComponent
    ], providers: [
        CurrencyPipe,
        MessageGuard
    ]
})
export class MessageModule {

}