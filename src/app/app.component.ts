import {
  Component
} from '@angular/core';

import {
  Platform
} from '@ionic/angular';
import {
  SplashScreen
} from '@ionic-native/splash-screen/ngx';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase/app';
import {
  environment
} from 'src/environments/environment';

import {
  AndroidPermissions
} from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ap: AndroidPermissions
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      firebase.initializeApp(environment.firebase);
      // this.statusBar.styleDefault();
      // set status bar to white
      this.statusBar.backgroundColorByHexString('#4F65F6');
      this.splashScreen.hide();
      this.checkLocationPermissions();
      this.checkCallPermission();
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
    //Extra Location Commands Callback    
    this.ap.checkPermission(this.ap.PERMISSION.CALL_PHONE).then((res) => {
      console.log('ACCESS_LOCATION_EXTRA_COMMANDS permission?', res.hasPermission)
    }).catch(err => this.ap.requestPermission(this.ap.PERMISSION.CALL_PHONE));
  }




}