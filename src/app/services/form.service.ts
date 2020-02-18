
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
    form.formId = id;
    return this.afs.doc(`naked_forms/${id}`).set(form, {
      merge: true
    });
  }

  updateNakedForm(formData, id) {
    return this.afs.doc(`naked_forms/${id}`).set(formData, {
      merge: true
    });
  }
  
  uploadNakedFormReport(form) {
    const id = this.afs.createId();
    form.reportId = id;
    return this.afs.doc(`naked_form_reports/${id}`).set(form, {
      merge: true
    });
  }


  
  uploadSpotReport(form) {
    const id = this.afs.createId();
    form.spotId = id;
    return this.afs.doc(`spot_reports/${id}`).set(form, {
      merge: true
    });
  }

  uploadIncidentType(data) {
    const id = this.afs.createId();
    data.incidentId = id;
    return this.afs.doc(`incident_types/${id}`).set(data, {
      merge: true
    });
  }

  uploadSRStatus(data) {
    const id = this.afs.createId();
    data.statusId = id;
    return this.afs.doc(`incident_statuses/${id}`).set(data, {
      merge: true
    });
  }

  uploadSRWhat(data) {
    const id = this.afs.createId();
    data.statusId = id;
    return this.afs.doc(`incident_whats/${id}`).set(data, {
      merge: true
    });
  }

  
  addProject(orgId, data) {
    const id = this.afs.createId();
    data.projectId = id;
    return this.afs.doc(`organizations/${orgId}/projects/${id}`).set(data, {
      merge: true
    });
  }

  updateProject(orgId, projectId, data) {
    return this.afs.doc(`organizations/${orgId}/projects/${projectId}`).set(data, {
      merge: true
    });
  }

  getAllForms(project) {
    const query = this.afs.collection(`naked_forms`, ref => ref.where('project','==', project));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getForms(project) {
    const query = this.afs.collection(`naked_forms`, ref => ref.where('project','==', project));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getIncidentTypes(org) {
    const query = this.afs.collection(`incident_types`, ref => ref.where('organization','==', org));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getSRStatuses(org) {
    const query = this.afs.collection(`incident_statuses`, ref => ref.where('organization','==', org));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getPreviousForms(org) {
    const query = this.afs.collection(`naked_form_reports`, ref => ref.where('organization','==', org));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }


  getNakedReports(project) {
    const query = this.afs.collection(`naked_form_reports`, ref => ref.where('project','==', project));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }

  getUserNakedReports(uid) {
    const query = this.afs.collection(`naked_form_reports`, ref => ref.where('userId','==', uid));
    if (query) {
      const querySub = query.valueChanges();
      return querySub;
    }
  }



}