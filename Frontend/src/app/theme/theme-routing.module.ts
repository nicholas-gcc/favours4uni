import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
// auth guard not implemented
// import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
    {
        path: "",
        component: ThemeComponent,
        // canActivate: [AuthGuard],
        children: [
            {
                path: "dashboard",
                loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: "favours",
                loadChildren: () => import('./pages/favours/favours.module').then(m => m.FavoursModule)
            },
            {
                path: "leaderboard",
                loadChildren: () => import('./pages/leaderboard/leaderboard.module').then(m => m.LeaderboardModule)
            },
            {
                path: "profile",
                loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: "message",
                loadChildren: () => import('./pages/message/message.module').then(m => m.MessageModule)
            },
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full"
            }
        ]
    },
    {
        path: "**",
        redirectTo: "dashboard",
        pathMatch: "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }