import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';
import {
  Component,
  OnInit
} from '@angular/core';


/* ------------------------------ Form Imports ------------------------------ */
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

import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  Router
} from '@angular/router';
import {
  UserService
} from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {


  submitForm = new FormGroup({
    firstName: new FormControl('None', [Validators.required]),
    lastName: new FormControl('None', [Validators.required]),
    email: new FormControl('None', [Validators.required]),
    phone: new FormControl('None', [Validators.required]),
    org: new FormControl('None', [Validators.required]),
    div: new FormControl('None', [Validators.required])
  });
 
  userData: any;
  userId: any;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];

  organization: any;
  division: any;
  organizations: any = [];

  constructor(private utils: UtilitiesService, private userService: UserService, private router: Router, private nativeStorage: NativeStorage) {}

  ngOnInit() {
    this.getUserData();
    this.getOrgs();
  }


  onOrganizationChange(): void {
    let cat = this.submitForm.get('org').value;
    this.organization = this.organizations.find(obj => {
      return obj.name === cat
    });
    console.log(cat);
    console.log(this.organization);
  }
  
  onDivChange(): void {
    let div = this.submitForm.get('division').value;
    this.division = div;
    console.log(this.division);
  }

  getOrgs() {
    this.userService.getOrgs().subscribe((res) => {
      this.organizations = res;
      console.log(res);
      console.log(this.organizations);
    });
  }

  getUserData() {
    this.utils.presentLoading('Please wait...');
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      console.log(userProfileSnapshot);
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.predefineVals(this.userData);  
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      console.log(err);
      // this.utils.handleError(err);
    });
  }


  predefineVals(user) {
    this.submitForm.setValue({
      name: user.fullName,
      email: user.email,
      phone: user.phone.number,
    });
  }


  async submitApplication() {
    let formData = this.submitForm.value;
    try {
      const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
      const regNumber = /^0[0-9].*$/;
      const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (regName.test(formData.name) && regEmail.test(formData.email)) {
        let data = {
          fullName: formData.firstName + " " + formData.lastName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: (formData.phone),
          division: this.division
        };
        console.log(this.userData.userId);
        this.userService.updateUser(this.userData.userId, data).then(() => {
          console.log('User Updated');
          this.utils.presentToast('Profile Updated Successfully!', 'toast-success');
          this.router.navigate(['tabs/profile'])
        });
      } else {
        this.utils.presentToast("There was a problem updating your profile because of invalid inputs, please check what you've typed and then try again.", 'toast-error');
      }
    } catch (err) {
      console.log(err.message);
      this.utils.presentToast('There was a problem updating your profile at this time, please check your internet connection and try again.', 'toast-error');
    }
  }

  forgotPassword() {
    let err: any  = {};
    err.message = 'Feature in Development';
    this.utils.handleError(err);
  }

}