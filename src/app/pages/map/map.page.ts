import {
  Component,
  OnInit
} from '@angular/core';
import {
  styles
} from '../../../assets/mapStyles';

//Custom
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';

//Firebase and GeoFireX
import * as firebaseApp from 'firebase/app';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import * as geofirex from 'geofirex';

//RXJS Libs
import {
  Observable,
  BehaviorSubject
} from 'rxjs';
import {
  switchMap
} from 'rxjs/operators';

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
  markers: any;
  mapIcon : any = {
    url: './assets/mapIcons/pin.svg',
    scaledSize: {
        width: 40,
        height: 60
    }
}
carIcon : any = {
  url: './assets/mapIcons/car2.svg',
  scaledSize: {
      width: 40,
      height: 60
  }
}

  //Example
  /*   markers: marker[] = [
  	  {
  		  lat: 51.673858,
  		  lng: 7.815982,
  		  label: 'A',
  		  draggable: true
  	  }
    ] */

  zoomLevel: number = 12;

  //GeoFireX Variables
  geo = geofirex.init(firebaseApp);
  points: Observable < any > ;
  radius = new BehaviorSubject(0.5);

  randomNames: any = ['Christopher', 'Ryan', 'Ethan', 'John', 'Zoey', 'Sarah', 'Michelle', 'Samantha', 'Job', 'Mary'];
  data: any = [];

  constructor(private geolocation: Geolocation, private firestore: AngularFirestore) {}

  ngOnInit() {
    this.getLatLng();
  }


  // Check if Marker has been clicked on
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  getLatLng() {
    // const cars = this.firestore.collection('cars');
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      const center = this.geo.point(this.lat, this.lng);
      const field = "pos";


      this.points = this.radius.pipe(
        switchMap(r => {
          return this.geo.query('users').within(center, r, field);
        }));

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


  randomGeo(radius) {
    var y0 = this.lat;
    var x0 = this.lng;
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    // var xp = x / Math.cos(y0);

    return {
      'latitude': y + y0,
      'longitude': x + x0
    };
  }


  // Very Useful Example For Ambulance Status Queries
  // Make a query like you normally would
  /* const users = firestore().collection('users').where('status', '==', 'online');


  const nearbyOnlineUsers = geo.query(users).within(center, radius, field); */

  /* -------------------------------------------------------------------------- */
  /*                  Data Generation Utility Functions                         */
  /* -------------------------------------------------------------------------- */

  /*   async generateUsers() {
      await this.randomNames.map(async (n) => {
        let latLng = await this.randomGeo(2000);
        this.data.push({
          name: n,
          lat:  latLng.latitude, 
          lng: latLng.longitude
        });
      });
      this.sendToFirestore();
    }
    
    sendToFirestore() {
      console.log('Start.')
      const users = this.firestore.collection('users');
      let counter = 0;
      while (counter < this.data.length) {
        const id = this.firestore.createId();
        const position = this.geo.point(this.data[counter].lat, this.data[counter].lng);
        this.firestore.doc(`users/${id}`).set({ name: this.data[counter].name, position }).then(() => {
          console.log('Added User.')
        }).catch((err) => console.error(err));
        counter += 1;
      }
      console.log('Done.')
    } */

}


// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label ? : string;
  draggable: boolean;
}