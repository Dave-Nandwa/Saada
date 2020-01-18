import {
  Component,
  OnInit
} from '@angular/core';

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
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Kenya, CountryISO.Tanzania, CountryISO.Uganda];
  phoneForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl(undefined, [Validators.required])
  });

  constructor(private uServ: UserService, private utils: UtilitiesService) {}

  ngOnInit() {}

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.SouthAfrica, CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  }

  submit() {
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const regNumber = /^0[0-9].*$/;
    const form = this.phoneForm.value;
    if (!regName.test(form.name)) {
      alert('Please enter your full name (first & last name).');
      return false;
    } else {
      if (regNumber.test(form.phone.number)) {
        alert('Please enter your Number in this format (eg. 0719634552');
      } else {
        if (form.name.length > 0 && form.phone) {
          this.utils.presentLoading('Creating Account...');
          this.uServ.addUser(form).then(() => {
            this.utils.dismissLoading();
            this.utils.presentToast('Account Created Successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.dismissLoading();
            console.log(err);
            this.utils.presentToast("Ooops! There was a problem creating your account, please try again. If this problem persists please message us.", "toast-error");
          });
          console.log(form);
        };
      }
      return true;
    }
  }


}