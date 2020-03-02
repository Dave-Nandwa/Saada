
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
export class AdminService {

  constructor( private afs: AngularFirestore, private alertController: AlertController, private utils: UtilitiesService, private uServ: UserService) {}

  // Update the Actual Labels
  changeHomeLabels(labels) {
    return this.afs.doc('home_labels/labels').set(labels, {
      merge: true
    });
  } 

  //Update Which Home Buttons are Displayed
  updateHomeButtons(data) {
    return this.afs.doc('home_labels/labels').set(data, {
      merge: true
    });
  }

  addSponsorCode(data) {
    const id = this.afs.createId();
    return this.afs.doc(`sponsor_codes/${id}`).set(data, {
      merge: true
    });
  } 

  addOrganization(data) {
    const id = this.afs.createId();
    data.orgId = id;
    return this.afs.doc(`organizations/${id}`).set(data, {
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

  addDivision(orgId, data) {
    return this.afs.doc(`organizations/${orgId}`).set(data, {
      merge: true
    });
  }

  
  deleteOrg(orgId) {
    return this.afs.doc(`organizations/${orgId}`).delete()
  }

  

  updateOrg(orgId, data) {
    return this.afs.doc(`organizations/${orgId}`).set(data, {
      merge: true
    });
  }



}
