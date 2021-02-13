import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class SigninGuard implements CanActivate {
  constructor(private _service: LoginService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isLogedIn = this._service.isLoggedIn;
    if (isLogedIn) {
      this._router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
