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
import {
  UserService
} from 'src/app/services/user.service';


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
  projects: any = [];
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
    let ind = 0;
    this.organization = this.organizations.find(obj => {
      return obj.name === cat
    });
    // Very VERY Hackish but it works for mapped projects under organzizations!
/*     Object.keys(this.organization).map((key, index) => {
      if (typeof(this.organization[key]) === 'object') {
        ind = index === 0 ? 1 : index-1;
        this.projects.push(this.organization['projects'][`project${ind}`]);
      }
    });  */
    this.utils.presentLoading('');
    this.uServ.getProjects(this.organization.orgId).subscribe((data)=> {
      this.projects = data;
      this.utils.dismissLoading();
    }, err => {
      this.utils.handleError(err);
    });
  }

  flattenObject(ob, prefix) {
    const toReturn = {};
    prefix = prefix ? prefix + '.' : '';

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if (typeof ob[i] === 'object' && ob[i] !== null) {
        // Recursion on deeper objects
        Object.assign(toReturn, this.flattenObject(ob[i], prefix + i));
      } else {
        toReturn[prefix + i] = ob[i];
      }
    }
    return toReturn;
  }
 
  onDivChange(): void {
    let div = this.loginForm.get('division').value;
    this.division = div;

  }

  onProjChange(): void {
    let proj = this.loginForm.get('project').value;
    this.project = proj;
    console.log(this.project);
  }

  getOrgs() {
    let orgSub = this.uServ.getOrgs().subscribe((res) => {
      this.organizations = res;
      orgSub.unsubscribe();
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
        form.project = this.project.name;
        form.projectId = this.project.projectId;
        form.division = this.division;
        if (form.cCode === '') {
          // Low-Level User
          form.clearance = 1
        } else if (form.cCode === '211') {
          // Division Admin
          form.clearance = 2
        } else if (form.cCode === '311') {
          //Project Admin
          form.clearance = 3
        } else if (form.cCode === '411') {
          //Org Admin
          form.clearance = 4
        } else if (form.cCode === '511') {
          //James and Ernie
          form.clearance = 5
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