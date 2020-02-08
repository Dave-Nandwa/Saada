import {
  FormService
} from 'src/app/services/form.service';

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
import {
  BackgroundMode
} from '@ionic-native/background-mode/ngx';

/* ---------------------------------- Firebase & Rxjs ---------------------------------- */
import {
  Observable,
  BehaviorSubject
} from 'rxjs';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private safetyNet: boolean = true;
  private bMode: boolean = false;
  options: any = [{
      name: 'checkbox1',
      type: 'checkbox',
      label: 'Landslide',
      value: 'Landslide',
    },
    {
      name: 'checkbox2',
      type: 'checkbox',
      label: 'Earthquake',
      value: 'Earthquake'
    },
    {
      name: 'checkbox3',
      type: 'checkbox',
      label: 'Disease Outbreak',
      value: 'Disease Outbreak'
    },
    {
      name: 'checkbox4',
      type: 'checkbox',
      label: 'Forest Fire',
      value: 'Forest Fire'
    },
  ];

  userData: any;
  userId: any;
  constructor(private formService: FormService, public backgroundMode: BackgroundMode, private utils: UtilitiesService, private lcn: LocalNotificationService, private router: Router, private nativeStorage: NativeStorage, private uServ: UserService) {}

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        console.log(this.userData);
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
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

  logOut() {
    // this.safeObs.subscribe(isAuth => console.log(isAuth));
    this.uServ.logOut();
    this.router.navigate(['login']);
  }


  selectFavourites() {
    this.formService.selectFavs(this.options, this.cancelHandler, this.successHandler);

  }

  /* --------------------- Handlers for the function above -------------------- */

  cancelHandler = () => {
    console.log("Cancelled.");
  };

  successHandler = (data: any) => {
    data.map((f, index) => data[index] = (f.toLowerCase().split(' ').join('_')));
    this.utils.presentLoading('Updating Profile...');
    this.uServ.updateUser(this.userData.userId, {
      favorites: data
    }).then(() => {
      this.utils.dismissLoading();
      this.utils.presentToast('Saved.', 'toast-success');
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

}