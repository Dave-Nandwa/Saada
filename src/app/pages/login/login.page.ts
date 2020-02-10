import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  RouterModule
} from '@angular/router';
/* ----------------------------- Form Variables ----------------------------- */

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO
} from 'ngx-intl-tel-input';

/* -------------------------------- Services -------------------------------- */

import {
  UserService
} from './../../services/user.service';
import {
  UtilitiesService
} from './../../services/utilities.service';

/* ---------------------------- Native Providers ---------------------------- */

import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';

/* -------------------------------- Firebase -------------------------------- */
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(undefined, Validators.minLength(6))
  });

  constructor(private uServ: UserService, private ns: NativeStorage, private utils: UtilitiesService, private router: Router) {}

  ngOnInit() {}

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.UnitedStates, CountryISO.Canada, CountryISO.SouthAfrica ];
  }

  submit() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const form = this.loginForm.value;
    if (!emailRegex.test(form.email)) {
      let err: any = {};
      err.message = 'Invalid Email Address';
      this.utils.handleError(err);
    } else {
      if (form.email && form.password) {
        this.utils.presentLoading('Logging you in...');
        this.uServ.loginUser(form.email, form.password).then(() => {
          this.utils.dismissLoading();
          this.utils.presentToast('Authentication Successful.', 'toast-success');
          let user = firebase.auth().currentUser
          this.router.navigate(['tabs/home']);
          // this.setuserInfo(data[0]);
        }).catch((error) => {
          // Handle Errors here.
          this.utils.dismissLoading();
          /* -------------------------------- Log Error ------------------------------- */
          console.log(error);
          this.utils.presentToast("Log In Error.", "toast-error");
          // Display Error Message to User
          this.utils.handleError(error);
        });

        /*     this.utils.presentLoading('Logging you in...');
            const dataSub = this.uServ.loginUser(form).subscribe((data) => {
              console.log(data);
              if (data.length <= 0) {
                alert("Ooops! There was a problem logging you in to your account, please check your internet connection and try again. If this problem persists please message us.");
                return;
              }
              this.utils.dismissLoading();
              this.utils.presentToast('Authentication Successful.', 'toast-success');
              this.setuserInfo(data[0]);
              dataSub.unsubscribe();
            }, err => {
              this.utils.dismissLoading();
              console.log(err);
              this.utils.presentToast("Ooops! There was a problem logging you in to your account, please try again. If this problem persists please message us.", "toast-error");
              dataSub.unsubscribe();
            }); */
      };
    }
  }

  setuserInfo(data) {
    this.ns.setItem('userInfo', {
      isLoggedIn: true,
      safetyNet: true,
      user: data
    }).then(() => {
      this.router.navigate(['tabs/home']);
    }).catch((err) => {
      this.router.navigate(['tabs/home']);
      console.error('Error storing item', err);
    });
  }

  signUp() {
    this.router.navigate(['/landing']);
  }


}