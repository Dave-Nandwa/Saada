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
  UtilitiesService
} from './../../services/utilities.service';
import {
  AuthService
} from 'src/app/services/auth.service';
/* ---------------------------- Native Providers ---------------------------- */

import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import { UserService } from 'src/app/services/user.service';


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
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];
  loginForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    cCode: new FormControl('', [Validators.required]),
    org: new FormControl(undefined, [Validators.required]),
    division: new FormControl(undefined, [Validators.required]),
    project: new FormControl(undefined, [Validators.required]),
  });

  lat: any = 0;
  lng: any = 0;

  organization: any;
  division: any;
  project: any;
  organizations: any = [];

  constructor(private uServ: UserService, private authService: AuthService, private geo: Geolocation, private ns: NativeStorage, private utils: UtilitiesService, private router: Router) {}

  ngOnInit() {
    this.getLatLng();
    this.getOrgs();
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geo.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.SouthAfrica, CountryISO.UnitedStates, CountryISO.Canada];
  }

  onOrganizationChange(): void {
    let cat = this.loginForm.get('org').value;
    this.organization = this.organizations.find(obj => {
      return obj.name === cat
    });
  }
  
  onDivChange(): void {
    let div = this.loginForm.get('division').value;
    this.division = div;
  
  }

  onProjChange(): void {
    let proj = this.loginForm.get('project').value;
    this.project = proj;
  }

  getOrgs() {
    this.uServ.getOrgs().subscribe((res) => {
      this.organizations = res;
      console.log(res);
      console.log(this.organizations);
    });
  }

  submit() {
    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const regNumber = /^0[0-9].*$/;
    const form = this.loginForm.value;
    if (!emailRegex.test(String(form.email).toLowerCase())) {
      alert('Please enter a valid email address.');
      console.log(form);
    } else {
      if (form.firstName.length > 0 && form.lastName.length > 0 && form.phone && form.email) {
        form.coords = [this.lat, this.lng];
        form.fullName = form.firstName + " " + form.lastName;
        form.organization = this.organization.name;
        form.orgId = this.organization.orgId;
        form.project = this.project;
        form.division = this.division;
        if (form.cCode === '') {
          // Low-Level User
          form.clearance = 4
        } else if (form.cCode === '211') {
          //Project Admin
          form.clearance = 2
        } else if (form.cCode === '311') {
          // Division Admin
          form.clearance = 3
        }
        this.utils.presentLoading('Creating Account...');
        this.authService.signup(form).then(() => {
          this.utils.dismissLoading();
          this.utils.presentToast('Account Created Successfully.', 'toast-success');
          this.router.navigate(['login']);
          // this.setUserInfo(form);
        }).catch((err) => {
          this.utils.dismissLoading();
          console.log(err);
          this.utils.handleError(err);
        });
        console.log(form);
      };
    }
    return true;
  }

  setUserInfo(data) {
    this.ns.setItem('userInfo', {
      isLoggedIn: true,
      user: data
    }).then(() => {
      this.router.navigate(['tabs/home']);
      console.log('Stored item!');
    }).catch((err) => {
      this.router.navigate(['tabs/home']);
      console.error('Error storing item', err);
    });
  }

  logIn() {
    this.router.navigate(['/login']);
  }


}