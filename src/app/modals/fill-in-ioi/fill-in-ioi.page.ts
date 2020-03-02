import {
  LocationSelectPage
} from 'src/app/modals/location-select/location-select.page';
import {
  ModalController
} from '@ionic/angular';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormlyFormOptions,
  FormlyFieldConfig
} from '@ngx-formly/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';
import {
  FormService
} from './../../services/form.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  Router
} from '@angular/router';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';



import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import {
  AddMediaPage
} from '../add-media/add-media.page';
import {
  HereService
} from 'src/app/services/here.service';



export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-fill-in-ioi',
  templateUrl: './fill-in-ioi.page.html',
  styleUrls: ['./fill-in-ioi.page.scss'],
})
export class FillInIoiPage implements OnInit {
  selectedForm;
  userData;
  lat;
  lng;
  form: any = new FormGroup({});
  formModel: any = {};
  fields: Array < FormlyFieldConfig > = [];

  dynamicForm: StepType[] = [];
  activeStep = 0;


  physicalAddr: any = {
    Address: 'N/A',
    City: 'N/A',
    State: 'N/A',
    District: 'N/A',
    Country: 'N/A',
    Lat: 'N/A',
    Lng: 'N/A',
    postalCode: 'N/A'
  };

  additionalData: any;
  geo = geofirex.init(firebaseApp);

  mediaFile: any = ['None'];
  mediaNotes: any = 'N/A';

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };


  previousForms: any = [];
  incidentTypes: any = [];

  incidentNames: any = [];
  what: any = 'N/A';
  previousName: any = 'N/A';
  status: any = 'N/A';
  segment: any = 'required';
  incidentStatuses: any = [];
  selectedIOI: any = [];
  currentAddress: any = {};
  geocodedData: any;
  repName: string = '';
  sioi: boolean = false;

  tabs: any = [];
  currentTabObject: any;
  selectedTabIndex: any = 0;
  model: any = {};

 

  constructor(
    private formService: FormService,
    private utils: UtilitiesService,
    private router: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modalCtrl: ModalController,
    private here: HereService,
    private _changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ionViewDidEnter() {
    // this.fields = < FormlyFieldConfig[] > JSON.parse(this.selectedForm.nakedForm);
    this.dynamicForm = < StepType[] > JSON.parse(this.selectedForm.nakedForm);
    this.form = new FormArray(this.dynamicForm.map(() => new FormGroup({})));
    this._changeDetectionRef.detectChanges();
    this.tabs = this.selectedForm.tabs;
    this.getNeededData();
    console.log('inited');
  }

  async doRefresh(event) {
    await this.getNeededData();
    event.target.complete();
  }

  prevStep(step) {
    this.activeStep = step - 1;
  }

  nextStep(step) {
    this.activeStep = step + 1;
  }


  // Change Tab Object on this event
  tabChange(event) {
    console.log('Tab Changed!');
    console.log(event);
    console.log(this.currentTabObject);
    this.selectedTabIndex = event.selectedIndex;
    this.currentTabObject = this.dynamicForm.find((obj: any) => {
      return obj.label === this.tabs[parseInt(this.selectedTabIndex)];
    });
    console.log(this.currentTabObject);
  }

  //Debug Function
  triggerClick() {
    console.log(`Selected tab index: ${this.selectedTabIndex}`);
  }

  async getNeededData() {
    this.utils.presentLoading('');
    await this.getPhysicalAddressHereAPI();
    await this.getPreviousForms();
    await this.getPreviousStatuses();
    await this.getIncidentTypes();
    this.utils.dismissLoading();
  }

  toggleCheckbox() {
    this.sioi = this.sioi === false ? true : false;
    console.log(this.sioi);
  }

  /* -------------------------------------------------------------------------- */
  /*                           Search by Address Field                          */
  /* -------------------------------------------------------------------------- */

  searchByAddressHereAPI() {
    this.utils.presentLoading('');
    let addr = ( < HTMLInputElement > document.querySelector('ion-input[name=address]')).value;
    if (addr.length > 1) {
      this.here.searchByAddress(addr).subscribe((res: any) => {
        if (res.Response.View[0].Result.length > 0) {
          this.geocodedData = res.Response.View[0].Result;
          let pa = res.Response.View[0].Result[0].Location.Address;
          this.physicalAddr = {
            Address: pa.Label,
            City: pa.City ? pa.City : 'N/A',
            State: pa.State ? pa.State : 'N/A',
            District: pa.District ? pa.District : 'N/A',
            Country: pa.AdditionalData[0].value,
            Lat: res.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
            Lng: res.Response.View[0].Result[0].Location.DisplayPosition.Longitude,
            postalCode: pa.PostalCode ? pa.PostalCode : 'N/A',
            Street: pa.Street ? pa.Street : 'N/A'
          }
        }
        this.utils.dismissLoading();
      }, (err) => {
        this.utils.dismissLoading();
        this.utils.handleError(err);
      });
    } else {
      this.utils.presentToast('You cannot search with an empty address field.', 'toast-error');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                   Search by latitude and longitude fields                  */
  /* -------------------------------------------------------------------------- */

  searchByLatLngHereAPI() {
    this.utils.presentLoading('');
    let lat = ( < HTMLInputElement > document.querySelector('ion-input[name=lat]')).value;
    let lng = ( < HTMLInputElement > document.querySelector('ion-input[name=lng]')).value;;
    let coords = lat + "," + lng;
    console.log(coords);
    let geoSub = this.here.revGeo(coords).subscribe((res: any) => {
      if ((res.Response.View[0].Result.length > 0)) {
        this.geocodedData = res.Response.View[0].Result;
        let pa = res.Response.View[0].Result[0].Location.Address;
        this.physicalAddr = {
          Address: pa.Label,
          City: pa.City ? pa.City : 'N/A',
          State: pa.State ? pa.State : 'N/A',
          District: pa.District ? pa.District : 'N/A',
          Country: pa.AdditionalData[0].value,
          Lat: res.Response.View[0].Result[0].Location.DisplayPosition.Latitude,
          Lng: res.Response.View[0].Result[0].Location.DisplayPosition.Longitude,
          postalCode: pa.PostalCode ? pa.PostalCode : 'N/A',
          Street: pa.Street ? pa.Street : 'N/A'
        }
        console.log(res.Response.View[0].Result);
        this.utils.dismissLoading();
      } else {
        this.utils.presentToast('UNEXPECTED ERROR: Cannot determine your location.', 'toast-error');
      }
      geoSub.unsubscribe();
    }, (err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  getPhysicalAddressHereAPI() {
    if (this.lat && this.lng) {
      console.log(JSON.stringify(this.lat) + "," + JSON.stringify(this.lng))
      let geoSub = this.here.revGeo(JSON.stringify(this.lat) + "," + JSON.stringify(this.lng)).subscribe((res: any) => {
        if ((res.Response.View[0].Result.length > 0)) {
          this.geocodedData = res.Response.View[0].Result;
          let pa = res.Response.View[0].Result[0].Location.Address;
          this.physicalAddr = {
            Address: pa.Label,
            City: pa.City ? pa.City : 'N/A',
            State: pa.State ? pa.State : 'N/A',
            District: pa.District ? pa.District : 'N/A',
            Country: pa.AdditionalData[0].value,
            Lat: this.lat,
            Lng: this.lng,
            postalCode: pa.PostalCode ? pa.PostalCode : 'N/A',
            Street: pa.Street ? pa.Street : 'N/A'
          }
          console.log(res.Response.View[0].Result);
        } else {
          this.utils.presentToast('UNEXPECTED ERROR: Cannot determine your location.', 'toast-error');
        }
        geoSub.unsubscribe();
      });
    } else {
      this.utils.presentToast('Latitude and Longitude not Received. Cannot Geocode.', 'toast-error');
    }
  }

  async uploadMediaModal() {

    const modal = await this.modalCtrl.create({
      component: AddMediaPage,
      componentProps: {
        userData: this.userData
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data.mediaFile.length > 0) {
        this.mediaFile.push(resp.data.mediaFile);
        this.mediaNotes = resp.data.notes
      } else {
        console.log('Modal Dismissed.')
      }
    });

    return await modal.present();
  }

  async locationSelectModal() {

    const modal = await this.modalCtrl.create({
      component: LocationSelectPage,
      componentProps: {
        lat: this.lat,
        lng: this.lng
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        this.lat = resp.data.lat;
        this.lng = resp.data.lng;
        this.getPhysicalAddressHereAPI();
      } else {
        console.log('Modal Dismissed.')
      }
    });

    return await modal.present();
  }

  getPreviousForms() {
    let dSub = this.formService.getPreviousForms(this.userData.organization).subscribe((data) => {
      this.previousForms = this.removeDuplicateReports(data, 'name');
      console.log(data);
      dSub.unsubscribe();
    });
  }

  removeDuplicateReports(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
  }

  getPreviousStatuses() {
    let dSub = this.formService.getSRStatuses(this.userData.organization).subscribe((data) => {
      this.incidentStatuses = data;
      dSub.unsubscribe();
      console.log('D2');
    });
  }

  getIncidentTypes() {
    let dSub = this.formService.getIncidentTypes(this.userData.organization).subscribe((data) => {
      this.incidentTypes = data;
      dSub.unsubscribe();
      console.log('D3');
    });
  }


  whatChanged(ev: any) {
    this.what = ev.detail.value;
    console.log(ev.detail.value);
  }

  async nameChanged(ev: any) {
    this.previousName = ev.detail.value;
    this.repName = ev.detail.value;
    const index = this.previousForms.findIndex(item => item.name === this.previousName);
    console.log(index);
    //Assign Selected IOI to var
    this.selectedIOI = await this.previousForms[index];
    //Change Variable
    this.physicalAddr = {
      ...this.selectedIOI.address
    }
  }

  statusChanged(ev: any) {
    this.status = ev.detail.value;
  }


  segmentChanged(e) {
    this.segment = (e.detail.value);
    this._changeDetectionRef.detectChanges();
  }


  async submit() {
    this.utils.presentLoading('Uploading IOI...');
    try {
      var dateTime = new Date().toLocaleString();
      const position = this.geo.point(this.lat, this.lng);
      this.additionalData = {
        address: {
          ...this.physicalAddr
        },
        position: position,
        latLng: `${this.lat} / ${this.lng}`,
        userId: this.userData.userId,
        organization: this.userData.organization,
        project: this.userData.project,
        division: this.userData.division,
        author: `${this.userData.fullName} (${this.userData.email})`,
        when: dateTime,
        formName: this.selectedForm.formName,
        reportName: this.previousName,
        what: this.what,
        status: this.status,
        mediaFile: this.mediaFile,
        mediaNotes: this.mediaNotes,
        name: this.repName.length > 1 ? this.repName : 'N/A',
        sioi: this.sioi
      }
      if (this.what !== 'N/A' && this.repName !== 'N/A') {
        let sendToDb = {
          formData: {
            ...this.formModel
          },
          ...this.additionalData
        }
        this.formService.uploadNakedFormReport(sendToDb).then(() => {
          this.utils.dismissLoading();
          this.modalCtrl.dismiss();
          this.utils.presentAlert('Success', '', 'IOI submitted successfully.');
        }).catch((err) => {
          this.utils.handleError(err);
        });
      } else {
        console.log('Form Not Valid.');
        this.utils.presentAlert('ERROR', '', 'Kindly Fill in All Required Fields First.')
      }
    } catch (err) {
      this.utils.dismissLoading();
      this.utils.handleError(err);
      console.log(err);
    }
  }


  getPhysicalAddress() {
    this.utils.presentLoading('Fetching Address...');
    this.nativeGeocoder.reverseGeocode(this.lat, this.lng, this.options)
      .then((result: NativeGeocoderResult[]) => {
        this.physicalAddr = result[0];
        this.utils.dismissLoading();
      }).catch((error: any) => {
        this.utils.dismissLoading();
        if (error === 'cordova_not_available') {
          //Reverse Geocode using another method, user is on the web not app.
          console.log('Reverse Geocode not Available, Only works on Native Devices.');
        } else {
          this.utils.handleError(error);
        }
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}