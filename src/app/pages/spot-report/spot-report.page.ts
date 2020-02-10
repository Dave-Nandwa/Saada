import {
  ModalController
} from '@ionic/angular';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  FormService
} from 'src/app/services/form.service';
import {
  Router
} from '@angular/router';


import * as firebaseApp from 'firebase/app';

import * as geofirex from 'geofirex';
import {
  AddMediaPage
} from 'src/app/modals/add-media/add-media.page';


@Component({
  selector: 'app-spot-report',
  templateUrl: './spot-report.page.html',
  styleUrls: ['./spot-report.page.scss'],
})
export class SpotReportPage implements OnInit {

  severity: any = 'Unknown';
  spotType: any = 'Incident';
  report: any = 'SpotReport';
  title: any = '';

  mediaFile: any = 'None';

  lat: any;
  lng: any;

  watch: any;
  userData: any;

  physicalAddr: any = {
    postalCode: '',
    locality: '',
    subLocality: '',
    thoroughfare: '',
    subThoroughfare: '',
    administrativeArea: '',
    countryCode: ''
  };
  geo = geofirex.init(firebaseApp);

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private utils: UtilitiesService,
    private userService: UserService,
    private formService: FormService,
    private router: Router,
    private modalController: ModalController) {}


  ngOnInit() {
    this.getUserData();
    this.getLatLng();
  }

  async uploadMediaModal() {

    const modal = await this.modalController.create({
      component: AddMediaPage
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data.mediaFile.length > 0) {
        this.mediaFile = resp.data.mediaFile;
      } else {
        console.log('Modal Dismissed.')
      }
    });

  }

  getUserData() {
    this.utils.presentLoading('Please wait...');
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.title = `${this.report} - ${this.userData.project} - ${this.userData.fullName}`;
        console.log(this.title);
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  ionViewDidLeave() {
    this.watch.unsubscribe();
  }

  severityChanged(ev: any) {
    this.severity = ev.detail.value;
  }


  typeChanged(ev: any) {
    this.spotType = ev.detail.value;
  }


  repChanged(ev: any) {
    this.report = ev.detail.value;
    //Change Title
    this.title = `${this.report} - ${this.userData.project} - ${this.userData.fullName}`;
    switch (ev.detail.value) {
      case "SpotReport":
        this.severity = 'Unknown';
        this.spotType = 'Incident';
        break;
      case "SpotWatch":
        this.severity = 'Minimal';
        this.spotType = 'Incident';
        break;
      case "Limited":
        this.severity = 'Significant';
        this.spotType = 'Incident';
        break;
      case "Closed":
        this.severity = 'Extraordinary';
        this.spotType = 'Incident';
        break;
      default:
        this.severity = 'Unknown';
        this.spotType = 'Incident';
    }
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      //Store Latitude and Longitude
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      //Chain Observable to User's location
      this.watchPosition();
      this.getPhysicalAddress();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getPhysicalAddress() {
    this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
      .then((result: NativeGeocoderResult[]) => {
        this.physicalAddr = result[0];
      })
      .catch((error: any) => {
        if (error === 'cordova_not_available') {
          //Reverse Geocode using another method, user is on the web not app.
          console.log('Reverse Geocode using another method, user is on the web not app.');
        } else {
          this.utils.handleError(error);
        }
      });
  }

  watchPosition() {
    this.watch = this.geolocation.watchPosition().subscribe((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    });
  }

  async addSpotReport() {
    try {
      const position = this.geo.point(this.lat, this.lng);
      var dateTime = new Date().toLocaleString();
      let spotReport: any = {
        name: this.title,
        what: this.spotType,
        description: ( < HTMLTextAreaElement > document.querySelector('textarea[name=desc]')).value ? ( < HTMLTextAreaElement > document.querySelector('textarea[name=desc]')).value : 'N/A',
        reason: ( < HTMLInputElement > document.querySelector('input[name=reason]')).value ? ( < HTMLInputElement > document.querySelector('input[name=reason]')).value : 'N/A',
        disposition: ( < HTMLInputElement > document.querySelector('input[name=disp]')).value ? ( < HTMLInputElement > document.querySelector('input[name=disp]')).value : 'N/A',
        status: this.severity,
        organization: this.userData.organization,
        division: this.userData.division,
        userId: this.userData.userId,
        createdBy: `${this.userData.fullName} (${this.userData.email})`,
        latLng: `${this.lat} / ${this.lng}`,
        when: dateTime,
        //Location Details
        zip: this.physicalAddr.postalCode ? this.physicalAddr.zip : 'N/A',
        city: this.physicalAddr.administrativeArea ? this.physicalAddr.administrativeArea : 'N/A',
        address: (this.physicalAddr.locality && this.physicalAddr.thoroughfare) ? `${this.physicalAddr.locality}, ${this.physicalAddr.subLocality}, ${this.physicalAddr.thoroughfare}, ${this.physicalAddr.countryCode}` : 'N/A',
        position: position,
        mediaFile: this.mediaFile
      };
      await this.evalIcon(spotReport);
      this.formService.uploadSpotReport(spotReport).then(() => {
        this.utils.presentAlert('Success!', '', 'Spot Report Submitted Successfully.');
        this.router.navigate(['/tabs/map']);
      }).catch((err) => {
        this.utils.handleError(err);
      });
    } catch (err) {
      this.utils.handleError(err);
    }
  }


  evalIcon(spotReport) {
    if ((spotReport.description.indexOf('fire') > -1) ||
      (spotReport.description.indexOf('burn') > -1) ||
      (spotReport.description.indexOf('forest') > -1)) {
      spotReport.icon = 'assets/map/fire.svg';
    } else if ((spotReport.description.indexOf('water') > -1) || (spotReport.description.indexOf('dam') > -1) || (spotReport.description.indexOf('leak') > -1)) {
      spotReport.icon = 'assets/map/dam.svg';
    } else if ((spotReport.description.indexOf('bldg') > -1) ||
      (spotReport.description.indexOf('crack') > -1) ||
      (spotReport.description.indexOf('earthquake') > -1) ||
      (spotReport.description.indexOf('earth') > -1) ||
      (spotReport.description.indexOf('fault') > -1) ||
      (spotReport.description.indexOf('building') > -1) ||
      (spotReport.description.indexOf('structure') > -1)) {
      spotReport.icon = 'assets/map/earthquake.svg';
    } else if ((spotReport.description.indexOf('bldg') > -1) ||
      (spotReport.description.indexOf('disease') > -1) ||
      (spotReport.description.indexOf('outbreak') > -1) ||
      (spotReport.description.indexOf('sickness') > -1) ||
      (spotReport.description.indexOf('sick') > -1) ||
      (spotReport.description.indexOf('quarantine') > -1) ||
      (spotReport.description.indexOf('hospital') > -1)) {
      spotReport.icon = 'assets/map/disease_outbreak.svg';
    } else {
      spotReport.icon = 'assets/map/general.svg';
    }
  }

  //Return Comma separated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }




}