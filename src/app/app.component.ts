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
  BackgroundMode
} from '@ionic-native/background-mode/ngx';

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
    public backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      /* ------------------------------ Init Firebase ----------------------------- */
      firebase.initializeApp(environment.firebase);

      /* -------------------------- Splash and Status Bar ------------------------- */

      this.statusBar.backgroundColorByHexString('#4F65F6');
      this.splashScreen.hide();
      /* ---------------------------- Check Permissions --------------------------- */

      this.checkLocationPermissions();
      this.checkCallPermission();
      this.checkStoragePermission();
      /* ---------------------- Listen for Power Button Press --------------------- */
      this.addVolumeButtonsListener()

      /* -------------------------- Listen for Close App -------------------------- */
      this.onClose();
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

  addVolumeButtonsListener() {
    // Default settings

    document.addEventListener("volumedownbutton", (info) => {
      this.onEvent(info);
    }, false);
    document.addEventListener("volumeupbutton", (info) => {
      this.onEvent(info);
    }, false);
  }

  clearRunTime() {
    this.hasOne = false;
    this.hasTwo = false;
    this.time[0] = 0;
    this.time[1] = 0;
    this.time[2] = 0;
    this.diff[0] = 0;
    this.diff[1] = 0;
};

  onClose() {
    /* ------------------------- Enable Background Mode ------------------------- */
    document.addEventListener("pause", () => {
      this.backgroundMode.enable();
    }, false);
    
  }

  onEvent(info) {
    var now = Date.now();
    
    // Clear runtime after timeout fot the 2nd click
    if (this.time[1] && now - this.time[1] >= this.maxClickInterval) {
        this.clearRunTime();
    }
    // Clear runtime after timeout fot the 3rd click
    if (this.time[0] && this.time[1] && now - this.time[0] >= this.maxClickInterval) {
        this.clearRunTime();
    }
    
    // Catch the third click
    if (this.hasTwo) {
        this.time[2] = Date.now();
        this.diff[1] = this.time[2] - this.time[1];
        
        var deltaPercent = 100.0 * (this.diff[1] /this.diff[0]);
        
        if (deltaPercent >= this.minPercentThird && deltaPercent <= this.maxPercentThird) {
            console.log("Triple Click!");
        }
        this.clearRunTime();
    }
    
    // Catch the first click
    else if (!this.hasOne) {
        this.hasOne = true;
        this.time[0] = Date.now();
    }
    
    // Catch the second click
    else if (this.hasOne) {
        this.time[1] = Date.now();
       this.diff[0] = this.time[1] - this.time[0];
        
        (this.diff[0] >= this.vminClickInterval &&this.diff[0] <= this.maxClickInterval) ?
            this.hasTwo = true : this.clearRunTime();
    } 
  }

}