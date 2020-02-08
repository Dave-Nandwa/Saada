import {
  Component,
  OnInit
} from '@angular/core';
import {
  services
} from './../../emergencies';
import {
  CallNumber
} from '@ionic-native/call-number/ngx';

/* ----------------------------- Custom Services ----------------------------- */

import {
  LocalNotificationService
} from 'src/app/services/local-notification.service';
import {
  LocationService
} from 'src/app/services/location.service';

/* -------------------------- Firebase and GeofireX ------------------------- */
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import {
  GeoFireQuery
} from 'geofirex';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  active: boolean = false;
  emergencies: any = services;
  numberToCall: string = this.emergencies[0].tels[0];
  tried: any = [];
  index: number = 0;

/* ------------------------------ Utility Vars ------------------------------ */

  randomNames: any = ["Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John"];
  data: any = [];
  watch: any;

  geo = geofirex.init(firebaseApp);

  constructor(private callNumber: CallNumber,
    private lnServ: LocalNotificationService,
    private lc: LocationService,
    private afs: AngularFirestore, 
    private utils: UtilitiesService) {}

  ngOnInit() {
    this.lnServ.enablePSNotif();
  }

  toggleClass(service) {
    /* -------------------------- Set Column to Active -------------------------- */
    this.emergencies.map((e) => e.active = false);
    service.active = true
    /* --------------------------- Set Number To Call --------------------------- */
    if (this.tried.includes(this.numberToCall)) {
      this.index = this.index < service.tels.length ? this.index++ : 0;
      this.numberToCall = service.tels[this.index];
    } else {
      this.numberToCall = service.tels[this.index];
    }
    this.tried.push(this.numberToCall);
  }

  callResponder() {
    this.callNumber.callNumber(this.numberToCall, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }


  /* ---------------------------- Utility Functions --------------------------- */

  randomDate() {
    return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
  }

  async generateReports() {

    await this.randomNames.map(async (n) => {
      let latLng = await this.lc.randomGeo(2000);
      this.data.push({
        name: n,
        lat: latLng.latitude,
        lng: latLng.longitude,
        category: 'landslide',
        timestamp: this.randomDate()
      });
    });
    this.sendToFirestore();
  }

  sendToFirestore() {
    console.log('Start.')
    const reports = this.afs.collection('incident_reports');
    let counter = 0;
    const batch = this.afs.firestore.batch();
    while (counter < this.data.length) {
      const id = this.afs.createId();
      const position = this.geo.point(this.data[counter].lat, this.data[counter].lng);
      let tempRef = this.afs.collection('incident_reports').doc(`${id}`).ref;
      batch.set(tempRef, {
        name: this.data[counter].name,
        onTrip: false,
        emergencyId: '',
        status: 'Inactive',
        tels: [`+1 ${this.randomPhoneNumber(8)}`],
        position
      });
      counter += 1;
    }
    batch.commit().then(() => {
      this.utils.presentAlert("Success", '','Added Fake Reports. Navigate to the map page to see the dynamically created points for testing purposes only.')
    }).catch((err) => console.error(err));
    console.log('Done.')
  }

  randomPhoneNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  }

}