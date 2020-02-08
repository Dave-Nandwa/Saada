
import {
  UtilitiesService
} from './utilities.service';
import {
  fire
} from './../emergencies';
import {
  Injectable
} from '@angular/core';
import {
  AlertController
} from '@ionic/angular';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  lat: any;
  lng: any;
  constructor( private afs: AngularFirestore, private alertController: AlertController, private utils: UtilitiesService, private uServ: UserService) {}

  async selectFavs(inputs, cancelHandler, successHandler) {
    const alert = await this.alertController.create({
      header: 'Select your QA Forms: ',
      inputs: inputs,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: cancelHandler
      }, {
        text: 'Save',
        handler: successHandler
      }]
    });
    await alert.present();
  }

  returnForm(selection: string, lat: any, lng: any) {
    this.lat = lat;
    this.lng = lng;
    switch (selection) {
      case "landslide":
        console.log("Landslide");
        this.lsForm();
        break;
      case "earthquake":
        console.log("Earthquake")
        this.eqForm();
        break;
      case "disease_outbreak":
        console.log("Disease Outbreak");
        this.dsoForm();
        break;
      case "forest_fire":
        console.log("Forest Fire");
        this.ffForm();
        break;
      default:
        let err: any = {};
        err.message('Form not found.');
        this.utils.handleError(err);
        console.log("Unknown");
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                               Specific Forms                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------- Landslide ------------------------------- */

  async presentForm(header, inputs) {
    const alert = await this.alertController.create({
      header: header,
      inputs: inputs,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Submit',
        handler: (data: any) => {
          // Log Timestamp for every entry in order to display it in the agm marker box
          console.log('Submitted Form');
          console.log(data);
          let coords = this.uServ.getLatLng();
          const geo = geofirex.init(firebaseApp);
          const position = geo.point(this.lat, this.lng);
          data.position = position;
          this.uServ.addIncidentReport(data).then((res) => {
            this.utils.presentToast('Incident Report Submitted Successfully!', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });

    await alert.present();
  }

  lsForm() {
    let inputs = [{
        name: 'name1',
        type: 'text',
        placeholder: 'Dummy Field'
      },
      {
        name: 'name2',
        type: 'text',
        id: 'name2-id',

        placeholder: 'Dummy Field'
      },
      // input date without min nor max
      {
        name: 'name5',
        type: 'date'
      },
      {
        name: 'name7',
        type: 'number',
        placeholder: '0000'
      }
    ];
    this.presentForm('Landslide Form', inputs);
  }

  /* ------------------------------- Earthquake ------------------------------- */

  eqForm() {
    let inputs = [{
        name: 'name1',
        type: 'text',
        placeholder: 'Dummy Field'
      },
      {
        name: 'name2',
        type: 'text',
        id: 'name2-id',

        placeholder: 'Dummy Field'
      },
      // input date without min nor max
      {
        name: 'name5',
        type: 'date'
      },
      {
        name: 'name7',
        type: 'number',
        placeholder: '0000'
      }
    ];
    this.presentForm('Earthquake Form', inputs);
  }

  /* ------------------------------- Forest fire ------------------------------ */

  ffForm() {
    let inputs = [{
        name: 'name1',
        type: 'text',
        placeholder: 'Dummy Field'
      },
      {
        name: 'name2',
        type: 'text',
        id: 'name2-id',

        placeholder: 'Dummy Field'
      },
      // input date without min nor max
      {
        name: 'name5',
        type: 'date'
      },
      {
        name: 'name7',
        type: 'number',
        placeholder: '0000'
      }
    ];
    this.presentForm('Forest Fire Form', inputs);
  }

  /* ---------------------------- Disease Outbreak ---------------------------- */

  dsoForm() {
    let inputs = [{
        name: 'name1',
        type: 'text',
        placeholder: 'Dummy Field'
      },
      {
        name: 'name2',
        type: 'text',
        id: 'name2-id',

        placeholder: 'Dummy Field'
      },
      // input date without min nor max
      {
        name: 'name5',
        type: 'date'
      },
      {
        name: 'name7',
        type: 'number',
        placeholder: '0000'
      }
    ];
    this.presentForm('Disease Quarantine Form', inputs);
  }

  uploadNakedForm(form) {
    const id = this.afs.createId();
    return this.afs.doc(`naked_forms/${id}`).set(form, {
      merge: true
    });
  }



}