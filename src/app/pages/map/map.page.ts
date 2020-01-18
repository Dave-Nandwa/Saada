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

import * as firebase from 'firebase/app';

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
      width: 40,
      height: 60
    }
  }

  zoomLevel: number = 15;

  /* --------------------------- GeoFireX Variables --------------------------- */

  geo = geofirex.init(firebaseApp);
  geoQuery: GeoFireQuery;
  points: Observable < any > ;
  radius = new BehaviorSubject(1);
  geoSub: any;

  /* ------------------------------ Utility Vars ------------------------------ */

  randomNames: any = ['Christopher', 'Ryan', 'Ethan', 'John', 'Zoey', 'Sarah', 'Michelle', 'Samantha', 'Job', 'Mary'];
  data: any = [];

  constructor(private geolocation: Geolocation, private afs: AngularFirestore, private lc: LocationService) {}

  ngOnInit() {
    // this.generateResponders();
    this.getLatLng();
  }

  ngOnDestroy() {
    this.geoSub.unsubscribe();
  }


  // Check if Marker has been clicked on
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  displayResponders() {
    if (this.geoSub) this.geoSub.unsubscribe();
    const center = this.geo.point(this.lat, this.lng);
    const field = "position";
    const responders = firebase.firestore().collection('users').where('onTrip', '==', false);
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

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  update(v) {
    this.radius.next(v);
  }

  watchPosition() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

  trackByFn(_, doc) {
    return doc.id;
  }




  // Very Useful Example For Ambulance Status Queries
  // Make a query like you normally would
  /* const users = firestore().collection('users').where('status', '==', 'online');


  const nearbyOnlineUsers = geo.query(users).within(center, radius, field); */

  /* -------------------------------------------------------------------------- */
  /*                  Data Generation Utility Functions                         */
  /* -------------------------------------------------------------------------- */

/*   async generateResponders() {

    await this.randomNames.map(async (n) => {
      let latLng = await this.lc.randomGeo(500);
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
    const users = this.afs.collection('users');
    let counter = 0;
    const batch = this.afs.firestore.batch();
    while (counter < this.data.length) {
      const id = this.afs.createId();
      const position = this.geo.point(this.data[counter].lat, this.data[counter].lng);
      let tempRef = this.afs.collection('users').doc(`${id}`).ref;
      batch.set(tempRef, {
        name: this.data[counter].name,
        onTrip: false,
        emergencyId: '',
        status: 'Inactive',
        tels: [],
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