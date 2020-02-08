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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
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
          coords: [0,0],
          position: 0,
          organization: data.organization,
          division: data.division,
          clearance: data.clearance
        });
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise < void > {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logout(): Promise < void > {
    return this.afAuth.auth.signOut();
  }
}