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

/* ------------------------------ SpotReports Modal ------------------------------ */

import {
  ModalController
} from '@ionic/angular';
import {
  SpotReportsPage
} from 'src/app/modals/spot-reports/spot-reports.page';
import {
  FillInIoiPage
} from 'src/app/modals/fill-in-ioi/fill-in-ioi.page';

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
      width: 80,
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
  mediaUrl: any;

  /* --------------------------- GeoFireX Variables --------------------------- */

  geo = geofirex.init(firebaseApp);
  geoQuery: GeoFireQuery;
  points: Observable < any > ;
  radius = new BehaviorSubject(2000);
  geoSub: any;
  nakedReportsSub: any;
  nakedReportsData: any;

  /* ------------------------------ Utility Vars ------------------------------ */

  randomNames: any = ['Red Cross', "N.W Hospital", "St John's", 'Aga Khan', 'St. John', 'Getrudes', 'M.P Shah', 'Mater Hospital', 'Police', 'Nairobi Hospital', 'Fire Truck'];
  data: any = [];
  watch: any;

  /* -------------------------- Directions Variables -------------------------- */

  public origin: any;
  public destination: any;
  public travelMode: string = 'DRIVING';
  public spotReports: any;
  public forms: any = [];
  public nakedReports: Observable < any > ;
  public showMedia: boolean = false;
  public users: any = [];

  openedWindow: string = ''; // alternative: array of numbers

  /* ------------------------ Naked Report Marker Vars ------------------------ */
  formTab: string = 'report';

  userData: any;
  constructor(
    public formService: FormService,
    public utils: UtilitiesService,
    public uServ: UserService,
    public callNumber: CallNumber,
    public geolocation: Geolocation,
    public alertController: AlertController,
    public modalController: ModalController) {}

  ngOnInit() {
    // this.generateResponders();
    
    this.getUserData();
    var closeBtn: any = document.querySelector('[title="Close"]');
    this.zoomLevel = 12;
  }

  zoomOut() {
    const interValZoom = setInterval(() => {
      this.zoomLevel -= 1;
      if (this.zoomLevel < 12) {
        clearInterval(interValZoom);
        // stop the zoom at your desired number
      }
    }, 100);
  }

  displayMediaFile(url) {
    this.showMedia = true;
    this.mediaUrl = url;
  }

  bdChange(e) {
    console.log(e);
  }

  segmentChanged(ev: any) {
    this.formTab = ev.detail.value;
  }

  async openSpotReportsModal() {
    //Reset Info Window
    this.openedWindow = 'None';
    const modal = await this.modalController.create({
      component: SpotReportsPage,
      componentProps: {
        spotReports: this.spotReports,
        nakedReports: this.nakedReportsData
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data !== 'None') {
        this.openWindow(resp.data);
      } else {
        console.log('Modal Dismissed.')
      }
    });

    return await modal.present();
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


  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.getLatLng();
        this.radius.next(this.userData.areaOfInterest);
        this.getForms();
        this.getNakedReports();
        this.getUsers();
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }



  getDirections(lat, lng) {
    this.origin = {
      lat: this.lat,
      lng: this.lng
    };
    this.destination = {
      lat: lat,
      lng: lng
    };
    var closeBtn: any = document.querySelector('[title="Close"]');
    closeBtn.click();
  }

  stopDirecting() {
    this.origin = null;
    this.destination = null;
    this.zoomOut();
  }

  requestForm(choice) {
    this.formService.returnForm(choice, this.lat, this.lng);
  }

  ngOnDestroy() {
    this.geoSub.unsubscribe();
    this.nakedReportsSub.unsubscribe();
    
  }

  ionViewDidLeave() {
    this.watch.unsubscribe();
  }


  // Check if Marker has been clicked on
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  openWindow(id) {
    this.openedWindow = id; // alternative: push to array of numbers
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id; // alternative: check if id is in array
  }

  displayReports() {
    if (this.geoSub) this.geoSub.unsubscribe();
    const center = this.geo.point(this.lat, this.lng);
    const field = "position";
    const reports = firebaseApp.firestore().collection('spot_reports');
    this.geoQuery = this.geo.query(reports)
    this.points = this.radius.pipe(
      switchMap(r => {
        return this.geoQuery.within(center, r, field, {
          log: true
        });
      }),
      shareReplay(1)
    );
    this.geoSub = this.points.subscribe(hits => {
      this.spotReports = hits;
    });
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
      console.log('Watching...');
      const position = this.geo.point(this.lat, this.lng);
      this.uServ.updateUser(this.userData.userId, {
        lat: this.lat,
        lng: this.lng,
        position: position
      });
    });
  }

  trackByFn(_, doc) {
    return doc.id;
  }

  callResponder(p) {
    this.callNumber.callNumber(p, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async presentNakedFormOptions() {
    const alert = await this.alertController.create({
      header: "IOI's",
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
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      this.utils.handleError(error);
    });
  }

  getUsers() {
    const users = firebaseApp.firestore().collection('users').where('orgId', '==', this.userData.orgId);
    users.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().userId !== this.userData.userId) {
          this.users.push({
            name: doc.data().fullName,
            email: doc.data().email,
            status: doc.data().status,
            statusNotes: doc.data().statusNotes,
            position: doc.data().position,
            lat: doc.data().lat,
            lng: doc.data().lng
          });
        }
      });
      console.log(this.users);
    }).catch((error) => {
      console.log("Error getting documents: ", error);
      this.utils.handleError(error);
    });
  }


  /*   getNakedReports() {
      this.formService.getNakedReports(this.userData.project).subscribe((data: any) => {
        this.nakedReports = data;
        console.log(data);
     /*    data.map((form) => {
          this.nakedReports.push({
            name: form.formName,
            type: 'radio',
            label: form.formName,
            value: JSON.stringify(form)
          });
        });
      });
    } */


  getNakedReports() {
    if (this.nakedReportsSub) this.nakedReportsSub.unsubscribe();
    const center = this.geo.point(this.lat, this.lng);
    const field = "position";
    const reports = firebaseApp.firestore().collection('naked_form_reports').where('project', '==', this.userData.project);
    this.geoQuery = this.geo.query(reports)
    this.nakedReports = this.radius.pipe(
      switchMap(r => {
        return this.geoQuery.within(center, r * 1609.344, field, {
          log: true
        });
      }),
      shareReplay(1)
    );
    this.nakedReportsSub = this.nakedReports.subscribe(hits => {
      this.nakedReportsData = hits;
    });
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