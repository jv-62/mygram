import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient, private _router: Router) { }

  baseUrl = environment.baseUrl;

  signin(email, password, functionName) {
    return this._http.get(`${this.baseUrl}${functionName}?EmailId=${email}&Password=${password}`);
  }

  public get isLoggedIn(): boolean {
    const token = sessionStorage.getItem('Users');
    return token == '' || token == null ? false : true;
  }

  public logOut() {
    sessionStorage.clear();
    this._router.navigate(['/signin'], { replaceUrl: true });
  }
}