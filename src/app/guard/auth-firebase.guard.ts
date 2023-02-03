// import { Injectable } from '@angular/core';
// import { Auth, authState } from '@angular/fire/auth';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { map, Observable } from 'rxjs';
// import { UserService } from '../service/user/user.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthFirebaseGuard implements CanActivate {
//   constructor(private auth: Auth, private router: Router, private userService: UserService) { }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return authState(this.auth).pipe(map(state => {
//       this.handleState(state);
//       return !!state
//     }));
//   }

//   private handleState(state: any) {
//     if (!state) {
//       this.router.navigateByUrl('/login');
//     } else {
//       this.userService.setUid();
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../service/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseGuard implements CanActivate {
  constructor(private afAuth: Auth, private router: Router, private userService: UserService, private ngZone: NgZone) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged(user => {
        if (!user) {
          this.ngZone.run(() => this.router.navigate(['/login']));
          resolve(false);
        } else {
          this.userService.setUid();
          resolve(true);
        }
      });
    });
  }
}