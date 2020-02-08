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

import {
  AlertController
} from '@ionic/angular';
import {
  FormService
} from 'src/app/services/form.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  UserService
} from 'src/app/services/user.service';


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
    url: './assets/mapIcons/marker.svg',
    scaledSize: {
      width: 60,
      height: 80
    }
  }
  carIcon: any = {
    url: './assets/mapIcons/incident.svg',
    scaledSize: {
      width: 25,
      height: 45
    }
  }

  zoomLevel: number = 12;

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

/* -------------------------- Directions Variables -------------------------- */

  private origin: any;
  private destination: any;
  private travelMode: string = 'DRIVING';

  userData: any;
  constructor(
    private formService: FormService,
    private utils: UtilitiesService,
    private uServ: UserService,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private afs: AngularFirestore,
    public alertController: AlertController) {}

  ngOnInit() {
    // this.generateResponders();
    this.getLatLng();
    this.getUserData();
  }


  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        console.log(this.userData);
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  getDirections(lat, lng) {
    this.origin = { lat: this.lat, lng: this.lng };
    this.destination = { lat: lat, lng: lng };
    var closeBtn: any = document.querySelector('[title="Close"]');
    closeBtn.click();
  }

  stopDirecting() {
    this.origin = null;
    this.destination = null;
  }

  requestForm(choice) {
    this.formService.returnForm(choice, this.lat, this.lng);
  }

  ngOnDestroy() {
    this.geoSub.unsubscribe();
    this.watch.unsubscribe();
  }


  // Check if Marker has been clicked on
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  displayReports() {
    if (this.geoSub) this.geoSub.unsubscribe();
    const center = this.geo.point(this.lat, this.lng);
    const field = "position";
    const reports = firebaseApp.firestore().collection('incident_reports').limit(11);
    this.geoQuery = this.geo.query(reports)
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
      this.displayReports();
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

  /*   policeCall() {
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
    } */

  callResponder(p) {
    this.callNumber.callNumber(p, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async presentNakedFormOptions() {
    const alert = await this.alertController.create({
      header: 'Naked Forms',
      inputs: [{
          name: 'radio1',
          type: 'radio',
          label: 'Landslide',
          value: 'Landslide',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Earthquake',
          value: 'Earthquake'
        },
        {
          name: 'radio3',
          type: 'radio',
          label: 'Disease Outbreak',
          value: 'Disease Outbreak'
        },
        {
          name: 'radio4',
          type: 'radio',
          label: 'Forest Fire',
          value: 'Forest Fire'
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Select',
        handler: (selection: string) => {
          selection = (selection.toLowerCase().split(' ').join('_'));
          this.formService.returnForm(selection, this.lat, this.lng);
        }
      }]
    });

    await alert.present();
  }


  zoomIn() {
    this.zoomLevel = 15;
    console.log('tapped');
  }




  // Very Useful Example For Ambulance Status Queries
  // Make a query like you normally would
  /* const users = firestore().collection('users').where('status', '==', 'online');


  const nearbyOnlineUsers = geo.query(users).within(center, radius, field); */

  /* -------------------------------------------------------------------------- */
  /*                  Data Generation Utility Functions                         */
  /* -------------------------------------------------------------------------- */




}