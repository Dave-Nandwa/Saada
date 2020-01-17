import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 
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

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

/* -------------------------------------------------------------------------- */
/*                                 AngularFire                                */
/* -------------------------------------------------------------------------- */
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
// firebase.initializeApp(credentials.firebaseConfig);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    //Angular Fire
    AngularFireModule.initializeApp(credentials.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
