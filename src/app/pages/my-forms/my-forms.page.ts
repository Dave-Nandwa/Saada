import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';

/* ------------------------------ Angular Fire ------------------------------ */
import {
  AngularFirestore
} from '@angular/fire/firestore';

/* ----------------------------- Custom Services ---------------------------- */

import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  FormService
} from 'src/app/services/form.service';

import {
  UserService
} from './../../services/user.service';

/* ---------------------------- Native Providers ---------------------------- */

import { Geolocation } from '@ionic-native/geolocation/ngx';

/* --------------------------------- Modals --------------------------------- */
import {
  ModalController
} from '@ionic/angular';
import {
  FillInIoiPage
} from 'src/app/modals/fill-in-ioi/fill-in-ioi.page';
import { EditIoiPage } from 'src/app/modals/edit-ioi/edit-ioi.page';
import { EditTabsIoiPage } from 'src/app/modals/edit-tabs-ioi/edit-tabs-ioi.page';


@Component({
  selector: 'app-my-forms',
  templateUrl: './my-forms.page.html',
  styleUrls: ['./my-forms.page.scss'],
})
export class MyFormsPage implements OnInit {
  userData: any;
  forms: any = [];
  selectedForm: any;
  lat: any;
  lng: any;
  isPublic: boolean = true;
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private uServ: UserService,
    private utils: UtilitiesService,
    private formService: FormService,
    private modalController: ModalController,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.utils.presentToast('Slide a list item to the right to delete it.', 'toast-info');
    this.getUserData();
    this.getLatLng();
  }

  async doRefresh(event) {
    this.utils.presentLoading('');
    await this.getForms();
    this.utils.dismissLoading();
    event.target.complete();
  }

  back() {
    this.router.navigateByUrl('/tabs/home');
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.getForms();
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
      //Store Latitude and Longitude
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log(resp);      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  getForms() {
    this.forms = [];
    let formSub = this.formService.getAllForms(this.userData.project).subscribe((data) => {
      this.forms = (data);
      console.log(data);
      formSub.unsubscribe();
    });
  }

  togChange($event) {
    this.isPublic = !this.isPublic;
    console.log('changed');
  }

  async openCreateModal(id) {

    this.selectedForm = this.forms.find(obj => {
      return obj.formId === id
    });

    const modal = await this.modalController.create({
      component: FillInIoiPage,
      componentProps: {
        selectedForm: this.selectedForm,
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

  async openEditModal(id) {

    this.selectedForm = this.forms.find(obj => {
      return obj.formId === id
    });

    const modal = await this.modalController.create({
      // component: EditIoiPage,
      component: EditTabsIoiPage,
      componentProps: {
        selectedForm: this.selectedForm,
        userData: this.userData,
        physicalAddr: this.selectedForm.address,
        lat: this.lat,
        lng: this.lng
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Modal Dismissed.');
      if (resp.data) {
        console.log(resp);
      }
      this.getForms();
    });

    return await modal.present();

  }

}