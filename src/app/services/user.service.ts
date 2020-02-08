import {
  Injectable
} from '@angular/core';

/* -------------------------- Angular Fire and Rxjs ------------------------- */

import {
  AngularFirestore,
} from '@angular/fire/firestore';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  Observable
} from 'rxjs';
import {
  switchMap,
  map
} from 'rxjs/operators';
/* ---------------------------- Native Providers ---------------------------- */

import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
// import { NativeStorage } from '@ionic-native/native-storage/ngx';

/* -------------------------------- Firebase -------------------------------- */
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  lat: any = 0.0;
  lng: any = 0.0;

  public userProfile: firebase.firestore.DocumentReference;
  public currentUser: firebase.User;

  constructor(private authService: AuthService, private afs: AngularFirestore, private afAuth: AngularFireAuth, private geolocation: Geolocation) {}


  loginUserWithPhone(data) {
    const query = this.afs.collection(`users`, ref => ref.where('phone', '==', (data.phone.internationalNumber).replace(/\s/g, '')));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }


  

  getOrgs() {
    const query = this.afs.collection(`organizations`);
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getDivs(org) {
    const query = this.afs.collection(`organizations`, ref => ref.where('name', '==', org));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  loginUser(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      console.log('Signed out successfully.')
    }).catch((err) => {
      console.log(err);
    })
  }


  updateUser(id, data) {
    return this.afs.doc(`users/${id}`).set(data, {
      merge: true
    });
  }

  addIncidentReport(data) {
    const id = this.afs.createId();
    return this.afs.doc(`incident_reports/${id}`).set(data, {
      merge: true
    });
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      return [this.lat, this.lng];
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async getUserProfile(): Promise<firebase.firestore.DocumentSnapshot> {
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
    this.userProfile = firebase.firestore().doc(`users/${user.uid}`);
    return this.userProfile.get();
  }

  async helpRequest(h) {
    try {
      let id = this.afs.createId();
      h.docId = id;
      return this.afs.doc(`help_requests/${id}`).set(h);
    } catch (err) {
      throw new Error(err);
    }
  }

  ngOnInit() {
    this.getLatLng();
  }

}