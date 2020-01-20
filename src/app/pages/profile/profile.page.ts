
import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
/* -------------------------------- Services -------------------------------- */

import {
  LocalNotificationService
} from 'src/app/services/local-notification.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
/* ----------------------------- Native Providers ---------------------------- */

import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

/* ---------------------------------- Rxjs ---------------------------------- */
import {
  Observable,
  BehaviorSubject
} from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private safetyNet : boolean = true;
  private bMode: boolean = false;
  constructor(public backgroundMode: BackgroundMode, private utils: UtilitiesService, private lcn: LocalNotificationService, private router: Router, private nativeStorage: NativeStorage, private uServ: UserService) {}

  ngOnInit() {
    this.initState();
  }
  changeState(e) {
    this.safetyNet = e.detail.checked;
    if (this.safetyNet === true) {
      this.enableSafetyNet();
    } else {
      this.disableSafetyNet();
    }
  }

  changeMode(e) {
    this.backgroundMode = e.detail.checked;
    if (this.bMode === true) {
      this.backgroundMode.enable();
      this.utils.presentToast('Background Mode Enabled.', 'toast-success');
    } else {
      this.backgroundMode.disable();
      this.utils.presentToast('Background Mode Disabled.', 'toast-error');
    }
  }


  disableSafetyNet() {
    this.utils.presentLoading('Disabling Safety Net...');
    this.nativeStorage.getItem('authState').then((data) => {
      console.log("BEFORE", data);
      if (data) {
        if (data.user.userId) {
          this.uServ.updateUser(data, {
            safetyNet: false
          }).then(() => {
            this.nativeStorage.setItem('authState', {
              isLoggedIn: true,
              safetyNet: false,
              user: data.user
            }).then(() => {
              this.lcn.clearAll();
              this.utils.dismissLoading();
              this.utils.presentToast('Safety Net Disabled.', 'toast-error');
            }).catch((err) => {
              console.log("There was a problem updating the user's profile", err);
            });
          }).catch((err) => {
            console.log("There was a problem updating the user's profile", err);
          });
        } else {
          console.log('USER ID NOT FOUND IN LOCAL STORAGE.');
          this.router.navigate(['login']);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  enableSafetyNet() {
    this.utils.presentLoading('Enabling Safety Net...');
    this.nativeStorage.getItem('authState').then((data) => {
      console.log("BEFORE", data);
      if (data) {
        if (data.user.userId) {
          this.uServ.updateUser(data, {
            safetyNet: true
          }).then(() => {
            this.nativeStorage.setItem('authState', {
              isLoggedIn: true,
              safetyNet: true,
              user: data.user
            }).then(() => {
              this.lcn.enablePSNotif();
              this.utils.dismissLoading();
              this.utils.presentToast('Safety Net Enabled.', 'toast-success');
            }).catch((err) => {
              console.log("There was a problem updating your profile", err);
            });
          }).catch((err) => {
            console.log("There was a problem updating your profile", err);
          });
        } else {
          console.log('USER ID NOT FOUND IN LOCAL STORAGE.');
          this.router.navigate(['login']);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  initState() {
    this.nativeStorage.getItem('authState').then((data) => {
      console.log("AFTER", data);
      if (data) {
        if (data.safetyNet) {
          this.safetyNet = data.safetyNet;
        }
      }
    }).catch((err) => console.log(err));
  }

  logOut() {
    // this.safeObs.subscribe(isAuth => console.log(isAuth));
    this.utils.presentLoading('Logging Out...');
    this.nativeStorage.clear().then(() => {
      this.lcn.clearAll();
      this.utils.dismissLoading();
      this.router.navigate(['login']);
      this.utils.presentToast('Logged Out.', 'toast-error')
    });
  }

}