import {
  Component,
  OnInit
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import { UtilitiesService } from './../../services/utilities.service';

/* ---------------------------- Native Providers ---------------------------- */

import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
  preferredCountries: CountryISO[] = [CountryISO.Kenya, CountryISO.Tanzania, CountryISO.Uganda];
  phoneForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(undefined, [Validators.required])
  });

  constructor(private uServ: UserService, private ns: NativeStorage, private utils: UtilitiesService, private router: Router) {}

  ngOnInit() {}

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.SouthAfrica, CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  }

  submit() {
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const regNumber = /^0[0-9].*$/;
    const form = this.phoneForm.value;
    if (regNumber.test(form.phone.number)) {
      alert('Please enter your Number in this format (eg. 0719634552');
    } else {
      if (form.phone) {
        this.utils.presentLoading('Logging you in...');
        const dataSub = this.uServ.loginUser(form).subscribe((data) => {
         /*   */
          console.log(data);
          if (data.length <= 0) {
            alert("Ooops! There was a problem logging you in to your account, please check your internet connection and try again. If this problem persists please message us.");
            return;
          }
          this.utils.dismissLoading();
          this.utils.presentToast('Authentication Successful.', 'toast-success');
          this.setAuthState(data[0]);
          dataSub.unsubscribe();
        }, err => {
          this.utils.dismissLoading();
          console.log(err);
          this.utils.presentToast("Ooops! There was a problem logging you in to your account, please try again. If this problem persists please message us.", "toast-error");
          dataSub.unsubscribe();
        });
      };
    }
  }

  setAuthState(data) {
    this.ns.setItem('authState', {isLoggedIn: true, safetyNet: true, user: data}).then(() => {
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