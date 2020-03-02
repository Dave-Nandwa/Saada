import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise(async (resolve, reject) => {
        try {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              if (firebase.auth().currentUser.emailVerified)  {
                console.log(firebase.auth().currentUser.emailVerified);
                resolve(true);
              } else {
                this.router.navigate(['/verify-email']);
                reject('User not Verified');
              }
            } else {
              return false;
            }
          });
        } catch (error) {
          reject(error);
        }
      });
  }
  
}
