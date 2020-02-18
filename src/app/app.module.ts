import {
  NgModule
} from '@angular/core';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  RouteReuseStrategy
} from '@angular/router';

import {
  IonicModule,
  IonicRouteStrategy
} from '@ionic/angular';


import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  AppRoutingModule
} from './app-routing.module';
import {
  AppComponent
} from './app.component';

//Environment File
import {
  environment
} from 'src/environments/environment';
import {
  credentials
} from '../credentials';
/* -------------------------------------------------------------------------- */
/*                              Native Providers                              */
/* -------------------------------------------------------------------------- */
import {
  SplashScreen
} from '@ionic-native/splash-screen/ngx';
import {
  StatusBar
} from '@ionic-native/status-bar/ngx';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  AndroidPermissions
} from '@ionic-native/android-permissions/ngx';
import {
  CallNumber
} from '@ionic-native/call-number/ngx';
import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';
import {
  LocalNotifications
} from '@ionic-native/local-notifications/ngx';
import {
  LocationAccuracy
} from '@ionic-native/location-accuracy/ngx';
import {
  Crop
} from '@ionic-native/crop/ngx';
import {
  NativeGeocoder
} from '@ionic-native/native-geocoder/ngx';
import {
  Camera
} from '@ionic-native/camera/ngx';
import {
  File
} from '@ionic-native/file/ngx';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser/ngx';

/* -------------------------------------------------------------------------- */
/*                                 AngularFire                                */
/* -------------------------------------------------------------------------- */
import {
  AngularFireModule
} from '@angular/fire';
import {
  AngularFireDatabaseModule
} from '@angular/fire/database';
import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFireAuthGuard
} from '@angular/fire/auth-guard';
import {
  AngularFireStorageModule
} from '@angular/fire/storage';

/* -------------------------------------------------------------------------- */
/*                               Custom Services                              */
/* -------------------------------------------------------------------------- */
import {
  LocationService
} from './services/location.service';
import {
  ConnectivityService
} from './services/connectivity.service';


import {
  UserService
} from './services/user.service';
import {
  UtilitiesService
} from './services/utilities.service';
import {
  LocalNotificationService
} from './services/local-notification.service';
import {
  FormService
} from './services/form.service';
import {
  HereService
} from './services/here.service';

import {
  FileChooser
} from '@ionic-native/file-chooser/ngx';
import {
  FilePath
} from '@ionic-native/file-path/ngx';

import {
  KeyvaluePipe
} from './pipes/keyvalue.pipe';

import {
  HttpClientModule
} from '@angular/common/http';



/* -------------------- Location Select Service and Modal ------------------- */

import {
  GoogleMapsService
} from './services/google-maps.service';
import { Network } from '@ionic-native/network/ngx';
import { AdminService } from './services/admin.service';


@NgModule({
  declarations: [AppComponent, KeyvaluePipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),

    /* ----------------------------- Angular Fire ----------------------------- */

    AngularFireModule.initializeApp(credentials.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    /* ------------------------------ Angular fire ------------------------------ */
    AngularFireAuthGuard,
    AngularFireAuth,
    /* ---------------------------- Native Providers ---------------------------- */
    LocationAccuracy,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    Geolocation,
    AndroidPermissions,
    NativeStorage,
    CallNumber,
    NativeGeocoder,
    Camera,
    File,
    FileChooser,
    FilePath,
    Crop,
    InAppBrowser,
    Network,
    /* ----------------------------- Custom Services ---------------------------- */
    LocalNotificationService,
    LocationService,
    UserService,
    UtilitiesService,
    FormService,
    HereService,
    ConnectivityService,
    GoogleMapsService,
    AdminService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}