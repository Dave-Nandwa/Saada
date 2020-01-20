import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private nativeStorage: NativeStorage, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.checkAuthState();
      return true;
  }

  checkAuthState() {
    this.nativeStorage.getItem('authState').then((data) => {
      console.log(data);
      if (data) {
        if (!(data.isLoggedIn === true)) {
          this.router.navigate(["landing"]);
          return false;
        }
        return true;
      }
    }).catch((err) => {
      if (err.code === 2){
        this.nativeStorage.setItem('authState', {isLoggedIn: false}).then(() => {
          this.router.navigate(['landing']);
          console.log('Stored item!');
          return false;
        }).catch((err) => {
          console.error('Error storing item', err);
        });  
      }
      return true;
    });
  }
  
}
