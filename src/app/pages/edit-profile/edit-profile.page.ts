import {
  NativeStorage
} from '@ionic-native/native-storage/ngx';
import {
  Component,
  OnInit,
  AfterViewInit
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
    phone: new FormControl(undefined, [Validators.required]),
    org: new FormControl('None', [Validators.required]),
    div: new FormControl('None', [Validators.required]),
    proj: new FormControl('None', [Validators.required]),
    aoi: new FormControl('None', [Validators.required]),
    code: new FormControl('None', [Validators.required])
  });

  userData: any;
  userId: any;
  projects: any = [];

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];

  organization: any = 'N/A';
  division: string = 'N/A';
  project: any = 'N/A';
  organizations: any = [];

  sponsorObject: any = {};
  sponsorCodes: any = [];
  userSponsorCodes: any = [];
  clearanceLevel: any = 1;

  constructor(private utils: UtilitiesService, private userService: UserService, private router: Router, private nativeStorage: NativeStorage) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.utils.presentLoading("Please wait...");
    this.getUserData();
  }

  async doRefresh(event) {
    await this.getUserData();
    event.target.complete();
  }

  async getSponsorCodes() {
    let sponserSub = this.userService.getSponsorCodes().subscribe((res) => {
      this.sponsorCodes = res;
      sponserSub.unsubscribe();
    });
  }

  async populateFields(sc) {
    if (sc.length > 0) {
      this.sponsorObject = this.sponsorCodes.find(obj => {
        return obj.sponsorCode === sc
      });
      if (this.sponsorObject) {
        this.organization = this.organizations.find(obj => {
          return obj.name === this.sponsorObject.organization
        });
        // Get Projects then continue
        this.utils.presentLoading('Please wait...');
        this.userService.getProjects(this.organization.orgId).subscribe((data) => {
          this.projects = data;
          this.division = this.sponsorObject.division;
          this.project = this.projects.find(obj => {
            return obj.name === this.sponsorObject.project
          });
          console.log(this.projects);
          this.clearanceLevel = this.sponsorObject.clearanceLevel;
          console.log(this.sponsorObject, this.project);
          // ( < HTMLInputElement > document.querySelector('input[name=sponsorCode]')).disabled = true;
          this.utils.presentToast('Sponsor Code Validated Successfully', 'toast-success');

          //Add Sponsor Code to User Doc
          this.userSponsorCodes.push(sc);
          this.utils.dismissLoading();
        }, err => {
          this.utils.handleError(err);
          this.utils.dismissLoading();
          return true;
        });
      } else {
        this.utils.presentToast('Invalid Sponsor Code!', 'toast-error');
        return false;
      }
    } else {
      let sponsorCode = ( < HTMLInputElement > document.querySelector('input[name=sponsorCode]')).value.substr(0, 10);

      this.sponsorObject = this.sponsorCodes.find(obj => {
        return obj.sponsorCode === sponsorCode
      });
      if (this.sponsorObject) {
        this.organization = this.organizations.find(obj => {
          return obj.name === this.sponsorObject.organization
        });
        // Get Projects then continue
        this.utils.presentLoading('Please wait...');
        this.userService.getProjects(this.organization.orgId).subscribe((data) => {
          this.projects = data;
          this.division = this.sponsorObject.division;
          this.project = this.projects.find(obj => {
            return obj.name === this.sponsorObject.project
          });
          this.clearanceLevel = this.sponsorObject.clearanceLevel;
          console.log(this.sponsorObject, this.project);
          // ( < HTMLInputElement > document.querySelector('input[name=sponsorCode]')).disabled = true;
          //Add Sponsor Code to User Doc
          this.userSponsorCodes.push(sponsorCode);
          this.utils.presentToast('Sponsor Code Validated Successfully', 'toast-success');
          this.utils.dismissLoading();
        }, err => {
          this.utils.handleError(err);
          this.utils.dismissLoading();
        });
      } else {
        this.utils.presentToast('Invalid Sponsor Code!', 'toast-error');
      }
    }
  }


  onCodeChange(): void {
    let ind = 0;
    let code = this.submitForm.get('code').value;
    this.populateFields(code)
  }

  onOrganizationChange(): void {
    let ind = 0;
    let cat = this.submitForm.get('org').value;
    this.organization = this.organizations.find(obj => {
      return obj.name === cat
    });
  }

  onDivChange(): void {
    let div = this.submitForm.get('div').value;
    this.division = div;
    console.log(this.division);
  }

  onProjChange(): void {
    let proj = this.submitForm.get('proj').value;
    // this.project = proj;
    this.project = this.projects.find(obj => {
      return obj.name === proj
    });
  }

  getOrgs() {
    let orgSub = this.userService.getOrgs().subscribe((res) => {
      this.organizations = res;
      this.organization = this.organizations.find(obj => {
        return obj.orgId === this.userData.orgId
      });

      this.utils.presentLoading('');
      this.userService.getProjects(this.organization.orgId).subscribe((data) => {
        this.projects = data;
        this.predefineVals(this.userData);
        this.utils.dismissLoading();
      }, err => {
        this.utils.handleError(err);
        this.utils.dismissLoading();
      });

      orgSub.unsubscribe();
    });
  }



  getUserData() {
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.getOrgs();
        this.getSponsorCodes();
        this.userSponsorCodes = [...new Set(this.userData.sponsorCodes)];
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      console.log(err);
      // this.utils.handleError(err);
    });
  }


  predefineVals(user) {
    this.submitForm.controls.phone.setValue(user.phone.number);
    this.division = this.userData.division;
    this.project = this.projects.find(obj => {
      return obj.name === this.userData.project
    });
    this.clearanceLevel = this.userData.clearance;
    this.submitForm.setValue({
      name: user.fullName,
      email: user.email,
    });
  }


  async saveUserData() {
    let formData = this.submitForm.value;
    try {
      const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
      const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      let data = {
        areaOfInterest: parseInt(formData.aoi),
        fullName: formData.firstName + " " + formData.lastName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: (formData.phone),
        division: this.division,
        project: this.project.name,
        projectId: this.project.projectId,
        orgId: this.organization.orgId,
        clearance: this.clearanceLevel,
        sponsorCodes: this.userSponsorCodes
      };

      if (regName.test(data.fullName) && regEmail.test(formData.email)) {
        console.log(data);
        // console.log(this.userData.userId);
        this.userService.updateUser(this.userData.userId, data).then(() => {
          console.log('User Updated');
          this.utils.presentToast('Profile Updated Successfully!', 'toast-success');
          this.router.navigate(['tabs/profile'])
        });
      } else {
        console.log(data);
        this.utils.presentToast("There was a problem updating your profile because of invalid inputs, please check what you've typed and then try again.", 'toast-error');
      }
    } catch (err) {
      console.log(err.message);
      this.utils.presentToast('There was a problem updating your profile at this time, please check your internet connection and try again.', 'toast-error');
    }
  }

  forgotPassword() {
    let err: any = {};
    err.message = 'Feature in Development';
    this.utils.handleError(err);
  }

}