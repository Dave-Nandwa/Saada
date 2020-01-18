
import { Injectable } from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {
  Observable
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  addUser(data) {
    const id = this.afs.createId();
    return this.afs.doc(`users/${id}`).set({
      fullName: data.name,
      firstName: (data.name).replace(/ .*/, ''),
      phone: (data.phone.internationalNumber).replace(/\s/g, ''),
      userId: id
    });
  }

}
