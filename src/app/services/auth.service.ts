import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  first
} from 'rxjs/operators';

import {
  auth
} from 'firebase/app';
import * as firebase from 'firebase/app';

import * as geofirex from 'geofirex';
import {
  Router
} from '@angular/router';
import {
  Platform
} from '@ionic/angular';
import {
  UtilitiesService
} from './utilities.service';
import {
  GooglePlus
} from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string;
  public geo = geofirex.init(firebase);

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private platform: Platform,
    private utils: UtilitiesService,
    private google: GooglePlus
  ) {}

  getUser(): Promise < firebase.User > {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  login(
    email: string,
    password: string
  ): Promise < firebase.auth.UserCredential > {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async signup(
    data: any
  ): Promise < firebase.auth.UserCredential > {
    try {
      const position = this.geo.point(data.coords[0], data.coords[1]);
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      await this.firestore
        .doc(`users/${newUserCredential.user.uid}`)
        .set({
          fullName: data.fullName,
          firstName: (data.firstName),
          lastName: (data.lastName),
          // phone: (data.phone.internationalNumber).replace(/\s/g, ''),
          phone: data.phone,
          email: data.email,
          password: data.password,
          userId: newUserCredential.user.uid,
          coords: data.coords,
          position: position,
          organization: data.organization,
          division: data.division,
          clearance: data.clearance,
          project: data.project,
          projectId: data.projectId,
          orgId: data.orgId,
          areaOfInterest: 2000,
          status: 'No Status',
          statusNotes: 'N/A',
          sponsorCodes: data.sponsorCodes,
          lat: 0,
          lng: 0,
          profileImage: 'None'
        });
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  async loginWithGoogle() {
    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    // this.router.navigate(['/home']);
  }

  googleSignIn() {
    let params;
    if (this.platform.is('android')) {
      params = {
        'webClientId': '64547518048-6k6ird7hog071lpd1dka9r2si0svdq5q.apps.googleusercontent.com',
        'offline': true
      }
    } else {
      params = {};
      this.loginWithGoogle();
      return false;
    }
    return this.google.login(params)
      .then((response) => {
        const {
          idToken,
          accessToken
        } = response
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error);
        if (error === 'cordova_not_available') {
          this.loginWithGoogle().then((res) => {
            console.log(res);
            this.utils.presentToast('Google Sign In Successful.', 'toast-success');
            this.router.navigate(['/tabs/home']);
          }).catch((err) => {
            this.utils.handleError(err);
            console.log(err);
          });
        } else {
          alert('error:' + JSON.stringify(error))
        }
      });
  }

  onLoginSuccess(accessToken, accessSecret) {
    this.utils.presentLoading('');
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
      .credential(accessToken);
    this.afAuth.auth.signInWithCredential(credential).then(() => {
      this.utils.dismissLoading();
      this.router.navigate(['/tabs/home']);
      this.utils.presentToast('Google Sign In Successful!', 'toast-success');
    }).catch((err) => {
      this.utils.handleError(err);
      console.log(err);
    })
  }

  onLoginError(err) {
    console.log(err);
  }

  async loginWithFacebook() {
    return await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
    // this.router.navigate(['/home']);
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  resetPassword(email: string): Promise < void > {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logout(): Promise < void > {
    return this.afAuth.auth.signOut();
  }
}