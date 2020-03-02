import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  AdminService
} from 'src/app/services/admin.service';
import {
  ModalController
} from '@ionic/angular';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-sponsor-code',
  templateUrl: './create-sponsor-code.page.html',
  styleUrls: ['./create-sponsor-code.page.scss'],
})
export class CreateSponsorCodePage implements OnInit {

  project: any = null;
  division: any = null;
  organization: any = null;
  projects: any = [];
  sponsorCode: any = null;
  sponsorCodes: any = [];
  private organizationsCollection: AngularFirestoreCollection < any > ;
  organizationsSub: Observable < any[] > ;
  organizations: any = [];
  createForm = new FormGroup({
    org: new FormControl(undefined, [Validators.required]),
    division: new FormControl(undefined, [Validators.required]),
    project: new FormControl(undefined, [Validators.required]),
  });
  constructor(
    private utils: UtilitiesService,
    private uServ: UserService,
    private adminService: AdminService,
    private modalCtrl: ModalController,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    console.log('Entered...');
    this.getOrgs();
  }


  onOrganizationChange(): void {
    let cat = this.createForm.get('org').value;
    let ind = 0;
    this.organization = this.organizations.find(obj => {
      return obj.name === cat
    });
    this.utils.presentLoading('');
    this.uServ.getProjects(this.organization.orgId).subscribe((data) => {
      this.projects = data;
      this.utils.dismissLoading();
    }, err => {
      this.utils.handleError(err);
      this.utils.dismissLoading();
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
    let div = this.createForm.get('division').value;
    this.division = div;

  }

  onProjChange(): void {
    let proj = this.createForm.get('project').value;
    this.project = proj;
    console.log(this.project);
  }

  getOrgs() {
    this.organizationsCollection = this.afs.collection('organizations');
    this.organizationsSub = this.organizationsCollection.valueChanges();
    let orgSub = this.organizationsSub.subscribe((res) => {
      this.organizations = res;
    });
  }

  addSponsorCode() {
    if (( < HTMLInputElement > document.querySelector('ion-input[name=sponsorCode]')).value.length === 10) {
      this.utils.presentLoading('');
      this.adminService.addSponsorCode({
        project: this.project.name,
        organization: this.organization.name,
        division: this.division,
        sponsorCode: ( < HTMLInputElement > document.querySelector('ion-input[name=sponsorCode]')).value.substr(0, 10),
        clearanceLevel: parseInt(( < HTMLInputElement > document.querySelector('ion-input[name=clearance]')).value)
      }).then(() => {
        this.utils.dismissLoading();
        this.utils.presentToast('Sponsor Code Added Successfully!', 'toast-success');
        this.modalCtrl.dismiss();
      }).catch((err) => {
        this.utils.dismissLoading();
        this.utils.handleError(err);
      });
    } else {
      this.utils.presentToast('Sponsor Code Must be 10 Characters Long!', 'toast-error');
    }
  }

  async getSponsorCodes() {
    let sponserSub = this.uServ.getSponsorCodes().subscribe((res) => {
      this.sponsorCodes = res;
      console.log(res);
      sponserSub.unsubscribe();
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}