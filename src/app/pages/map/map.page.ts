import {
  Component,
  OnInit
} from '@angular/core';

/* ---------------------------------- Misc ---------------------------------- */

import {
  styles
} from '../../../assets/mapStyles';

/* ---------------------------- Native Providers ---------------------------- */

import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  CallNumber
} from '@ionic-native/call-number/ngx';

/* -------------------------- Firebase and GeoFireX ------------------------- */

import * as firebaseApp from 'firebase/app';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import * as geofirex from 'geofirex';
import {
  GeoFireQuery
} from 'geofirex';
/* ------------------------------- RXJS Libs ------------------------------ */

import {
  Observable,
  BehaviorSubject
} from 'rxjs';
import {
  switchMap,
  shareReplay
} from 'rxjs/operators';

/* -------------------------------- Services -------------------------------- */
import {
  LocationService
} from './../../services/location.service';

import {
  medical,
  fire,
  police,
  services
} from './../../emergencies';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  //Map Variables
  mapStyles: any = styles;

  lat: number = -1.286389;
  lng: number = 36.817223;

  // Emergency Services
  emergencies: any = services;
  medical: any = medical;
  police: any = police;
  fire: any = fire;
  tried: any = [];
  index: number = 0;

  mapIcon: any = {
    url: './assets/mapIcons/pin.svg',
    scaledSize: {
      width: 40,
      height: 60
    }
  }
  carIcon: any = {
    url: './assets/mapIcons/car.svg',
    scaledSize: {
      width: 25,
      height: 45
    }
  }

  zoomLevel: number = 15;

  /* --------------------------- GeoFireX Variables --------------------------- */

  geo = geofirex.init(firebaseApp);
  geoQuery: GeoFireQuery;
  points: Observable < any > ;
  radius = new BehaviorSubject(3.5);
  geoSub: any;

  /* ------------------------------ Utility Vars ------------------------------ */

  randomNames: any = ['Red Cross', "N.W Hospital", "St John's", 'Aga Khan', 'St. John', 'Getrudes', 'M.P Shah', 'Mater Hospital', 'Police', 'Nairobi Hospital', 'Fire Truck'];
  data: any = [];
  watch: any;

  constructor(private callNumber: CallNumber, private geolocation: Geolocation, private afs: AngularFirestore, private lc: LocationService) {}

  ngOnInit() {
    // this.generateResponders();
    this.getLatLng();
  }

  ngOnDestroy() {
    this.geoSub.unsubscribe();
    this.watch.unsubscribe();
  }


  // Check if Marker has been clicked on
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  displayResponders() {
    if (this.geoSub) this.geoSub.unsubscribe();
    const center = this.geo.point(this.lat, this.lng);
    const field = "position";
    const responders = firebaseApp.firestore().collection('responders').where('onTrip', '==', false);
    this.geoQuery = this.geo.query(responders)
    console.log(this.geoQuery);
    this.points = this.radius.pipe(
      switchMap(r => {
        return this.geoQuery.within(center, r, field, {
          log: true
        });
      }),
      shareReplay(1)
    );

    this.geoSub = this.points.subscribe(hits => console.log(hits));
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.displayResponders();
      this.watchPosition();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  update(v) {
    this.radius.next(v);
  }

  watchPosition() {
    this.watch = this.geolocation.watchPosition().subscribe((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    });
  }

  trackByFn(_, doc) {
    return doc.id;
  }

  policeCall() {
    if (this.tried.includes(this.police[this.index])) {
      this.index = this.index < police.length ? this.index++ : 0;
      this.police[this.index] = this.police[this.index];
    } else {
      this.police[this.index] = this.police[this.index];
    }
    this.tried.push(this.police[this.index]);
    this.callNumber.callNumber(this.police[this.index], true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  fireCall() {
    if (this.tried.includes(this.fire[this.index])) {
      this.index = this.index < police.length ? this.index++ : 0;
      this.fire[this.index] = this.fire[this.index];
    } else {
      this.fire[this.index] = this.fire[this.index];
    }
    this.tried.push(this.fire[this.index]);
    this.callNumber.callNumber(this.fire[this.index], true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }


  medCall() {
    if (this.tried.includes(this.medical[this.index])) {
      this.index = this.index < police.length ? this.index++ : 0;
      this.medical[this.index] = this.medical[this.index];
    } else {
      this.medical[this.index] = this.medical[this.index];
    }
    this.tried.push(this.medical[this.index]);
    this.callNumber.callNumber(this.medical[this.index], true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  callResponder(p) {
    this.callNumber.callNumber(p, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }



  // Very Useful Example For Ambulance Status Queries
  // Make a query like you normally would
  /* const users = firestore().collection('users').where('status', '==', 'online');


  const nearbyOnlineUsers = geo.query(users).within(center, radius, field); */

  /* -------------------------------------------------------------------------- */
  /*                  Data Generation Utility Functions                         */
  /* -------------------------------------------------------------------------- */


/*   randomPhoneNumber(length) {

    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));

  }

  async generateResponders() {

    await this.randomNames.map(async (n) => {
      let latLng = await this.lc.randomGeo(2000);
      this.data.push({
        name: n,
        lat: latLng.latitude,
        lng: latLng.longitude,
        onTrip: false,
        emergencyId: ''
      });
    });
    this.sendToFirestore();
  }

  sendToFirestore() {
    console.log('Start.')
    const responders = this.afs.collection('responders');
    let counter = 0;
    const batch = this.afs.firestore.batch();
    while (counter < this.data.length) {
      const id = this.afs.createId();
      const position = this.geo.point(this.data[counter].lat, this.data[counter].lng);
      let tempRef = this.afs.collection('responders').doc(`${id}`).ref;
      batch.set(tempRef, {
        name: this.data[counter].name,
        onTrip: false,
        emergencyId: '',
        status: 'Inactive',
        tels: [`+2547${this.randomPhoneNumber(8)}`],
        position
      });
      counter += 1;
    }
    batch.commit().then(() => {
      console.log('Added Users.')
    }).catch((err) => console.error(err));
    console.log('Done.')
  } */

}