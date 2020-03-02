import {
  Component
} from '@angular/core';

import {
  Platform
} from '@ionic/angular';


/* -------------------------------- Firebase -------------------------------- */

import * as firebase from 'firebase/app';
import {
  environment
} from 'src/environments/environment';

/* -------------------------------------------------------------------------- */
/*                              Native Providers                              */
/* -------------------------------------------------------------------------- */

import {
  AndroidPermissions
} from '@ionic-native/android-permissions/ngx';
import {
  LocalNotifications
} from '@ionic-native/local-notifications/ngx';


import {
  LocationAccuracy
} from '@ionic-native/location-accuracy/ngx';

import {
  SplashScreen
} from '@ionic-native/splash-screen/ngx';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  /* ---------------------------- Triple Click Vars --------------------------- */

  vminClickInterval: any = 100;
  maxClickInterval: any = 500;
  minPercentThird: any = 85.0;
  maxPercentThird: any = 130.0;

  // Runtime
  hasOne: any = false;
  hasTwo: any = false;
  time: any = [0, 0, 0];
  diff: any = [0, 0];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ap: AndroidPermissions,
    private localNotifications: LocalNotifications,
    private locationAccuracy: LocationAccuracy
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      /* ------------------------------ Init Firebase ----------------------------- */
      // firebase.initializeApp(environment.firebase);

      /* -------------------------- Splash and Status Bar ------------------------- */

      this.statusBar.backgroundColorByHexString('#4F65F6');
      this.splashScreen.hide();
      /* ---------------------------- Check Permissions --------------------------- */

      this.checkLocationPermissions();
      this.checkCallPermission();
      this.checkStoragePermission();

      /* ---------------------- Request for Location Accuracy --------------------- */
      this.requestAccuracy();
    });

  }

  // Looks worse than it is
  //Mild Callback hell
  checkLocationPermissions() {
    //Coarse Location Callback
    this.ap.checkPermission(this.ap.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        console.log('ACCESS_COARSE_LOCATION permission?', result.hasPermission);

        //Coarse Fine Location Callback        
        this.ap.checkPermission(this.ap.PERMISSION.ACCESS_FINE_LOCATION).then(
          result => {
            console.log('ACCESS_FINE_LOCATION permission?', result.hasPermission);

            //Extra Location Commands Callback    
            this.ap.checkPermission(this.ap.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS).then(
              result => {
                console.log('ACCESS_LOCATION_EXTRA_COMMANDS permission?', result.hasPermission)
              },
              err => this.ap.requestPermission(this.ap.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS));
          },
          err => this.ap.requestPermission(this.ap.PERMISSION.ACCESS_FINE_LOCATION));

        //Background Location Callback
        this.ap.checkPermission(this.ap.PERMISSION.ACCESS_BACKGROUND_LOCATION).then(
          result => console.log('ACCESS_BACKGROUND_LOCATION permission?', result.hasPermission),
          err => this.ap.requestPermission(this.ap.PERMISSION.ACCESS_BACKGROUND_LOCATION)
        );

      },
      err => this.ap.requestPermission(this.ap.PERMISSION.ACCESS_COARSE_LOCATION)
    );

  }

  checkCallPermission() {
    //Call Permissions
    this.ap.checkPermission(this.ap.PERMISSION.CALL_PHONE).then((res) => {
      console.log('CALL permission?', res.hasPermission);

      // Contacts Permissions
      this.ap.checkPermission(this.ap.PERMISSION.READ_CONTACTS).then((res) => {
        console.log('Contacts permission?', res.hasPermission)
      }).catch(err => this.ap.requestPermission(this.ap.PERMISSION.READ_CONTACTS));

    }).catch(err => this.ap.requestPermission(this.ap.PERMISSION.CALL_PHONE));
  }


  checkStoragePermission() {
    this.ap.checkPermission(this.ap.PERMISSION.READ_EXTERNAL_STORAGE).then((res) => {
      console.log('Read Storage permission?', res.hasPermission)
    }).catch(err => this.ap.requestPermission(this.ap.PERMISSION.READ_EXTERNAL_STORAGE));
    this.ap.checkPermission(this.ap.PERMISSION.WRITE_EXTERNAL_STORAGE).then((res) => {
      console.log('Write Storage permission?', res.hasPermission)
    }).catch(err => this.ap.requestPermission(this.ap.PERMISSION.WRITE_EXTERNAL_STORAGE));
  }

  checkStickyStatus() {
    const locSub = this.localNotifications.on('stop').subscribe(() => {
      this.localNotifications.clearAll();
      locSub.unsubscribe()
    });
  }



  requestAccuracy() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }

    }); 
  }

}