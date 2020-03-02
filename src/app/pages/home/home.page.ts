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

/* ------------------------------ Status Modal ------------------------------ */

import { ModalController, AlertController } from '@ionic/angular';
import { StatusPage } from 'src/app/modals/status/status.page';
import { UserService } from 'src/app/services/user.service';

/* -------------------------------- IOI Modal ------------------------------- */
import { FillInIoiPage } from './../../modals/fill-in-ioi/fill-in-ioi.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  userData: any;
  org: any;
  geo = geofirex.init(firebaseApp);
  project: any;
  homeLabels: any = [];
  lat: any;
  lng: any;
  forms: any = [];

  constructor(
    public modalController: ModalController,
    private callNumber: CallNumber,
    private lnServ: LocalNotificationService,
    private lc: LocationService,
    private afs: AngularFirestore, 
    private utils: UtilitiesService,
    private uServ: UserService,
    private geolocation: Geolocation,
    private alertController: AlertController) {}

  ngOnInit() {
    // this.lnServ.enablePSNotif();
    this.getUserData();
  }

  async doRefresh(event) {
    await this.getUserData();
    event.target.complete();
  }

  async openIoiModal(form) {

    const modal = await this.modalController.create({
      component: FillInIoiPage,
      componentProps: {
        selectedForm: form,
        userData: this.userData,
        lat: this.lat,
        lng: this.lng
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        console.log(resp);
      }
    });

    return await modal.present();
  }
  

  async getSpecificForm(formName) {
    console.log(formName);
    let specificForm = await this.forms.find((form) => {
      return form.name === formName
    });
    this.openIoiModal(JSON.parse(specificForm.value));
  }

  async presentNakedFormOptions() {
    const alert = await this.alertController.create({
      header: "Select Form",
      inputs: this.forms,
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
          this.openIoiModal(JSON.parse(selection));
          // this.formService.returnForm(selection, this.lat, this.lng);
        }
      }]
    });
    await alert.present();
  }

  getForms() {
    this.forms = [];
    this.utils.presentLoading('Fetching Forms...');
    const forms = firebaseApp.firestore().collection('naked_forms').where('project', '==', this.userData.project);
    forms.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.forms.push({
          name: doc.data().formName,
          type: 'radio',
          label: doc.data().formName,
          value: JSON.stringify(doc.data())
        });
      });
      this.utils.dismissLoading();
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      this.utils.handleError(error);
      this.utils.dismissLoading();
    });
  }

  getHomeLabels() {
    this.utils.presentLoading('');
    this.uServ.getHomeLabels().then((snap: any) => {
      this.homeLabels = snap.data();
      this.utils.dismissLoading();
      this.getForms();
    }).catch((err) => {
      this.utils.handleError(err);
      this.utils.dismissLoading();
    });
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      this.utils.dismissLoading();
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.uServ.getOrg(this.userData.orgId).subscribe((data) => {
          this.org = data;
          this.getUserProject(this.org.orgId, this.userData.projectId);
          this.getHomeLabels();
          this.getLatLng();
        }, (err) => {
          this.utils.handleError(err);
        });
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
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

  async changeStatus() {
    const modal = await this.modalController.create({
      component: StatusPage
    });
    return await modal.present();
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

  getUserProject(orgId, projId) {
    this.uServ.getProject(orgId, projId).subscribe((res) => {
      this.project = res;
      console.log(res);
    }, (err) => {
      this.utils.handleError(err);
    });
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