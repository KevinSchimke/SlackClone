import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return authState(this.auth).pipe(map(state => {
      this.handleState(state);
      console.log(state);

      return !!state
    }));
  }

  private handleState(state: any) {
    if (!state)
      this.router.navigateByUrl('/login');
  }
}