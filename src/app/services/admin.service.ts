
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

}
