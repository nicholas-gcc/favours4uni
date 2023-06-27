import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AppService } from '../../../_services/app.service';


@Injectable()
export class MessageGuard implements CanActivate {

    constructor(private _router: Router, private app: AppService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let valid = this.app.getToken();
        if (valid) {
            return true;
        } else {
            this.app.deleteCookies();
            this._router.navigate(['/login'])
            return false;
        }
    }
}