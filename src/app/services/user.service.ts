
import { Injectable } from '@angular/core';

/* -------------------------- Angular Fire and Rxjs ------------------------- */

import {
  AngularFirestore
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {
  Observable
} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
/* ---------------------------- Native Providers ---------------------------- */

import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
// import { NativeStorage } from '@ionic-native/native-storage/ngx';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  lat: any;
  lng: any;
  constructor(private afs: AngularFirestore, private geolocation: Geolocation) { }

  addUser(data) {
    const id = this.afs.createId();
    return this.afs.doc(`users/${id}`).set({
      fullName: data.name,
      firstName: (data.name).replace(/ .*/, ''),
      phone: (data.phone.internationalNumber).replace(/\s/g, ''),
      userId: id,
      coords:  [this.lat, this.lng],
      safetyNet: true
    });
  }

  loginUser(data) {
    const query = this.afs.collection(`users`, ref=> ref.where('phone', '==', (data.phone.internationalNumber).replace(/\s/g, '')));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  
  updateUser(id, data) {
    return this.afs.doc(`users/${data.userId}`).set(data, {merge: true});
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  ngOnInit() {
    this.getLatLng();
  }

}
