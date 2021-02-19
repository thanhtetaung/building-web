import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {


  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const result = this.isAuthenticated();
    if (state.url.endsWith('login') || state.url.endsWith('register')) {
      if (result) {
        this.router.navigate(['/']);
      }
      return !result;
    } else {
        if (!result) {
          this.router.navigate(['/login']);
        }
        return result;
      }
  }


  isAuthenticated() {
    return localStorage.getItem('accessToken') != null;
  }
}
