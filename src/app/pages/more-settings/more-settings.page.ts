import {
  FormService
} from './../../services/form.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AlertController,
  ModalController
} from '@ionic/angular';
import {
  UserService
} from 'src/app/services/user.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  AdminService
} from 'src/app/services/admin.service';
import {
  AddIoiTypePage
} from 'src/app/modals/add-ioi-type/add-ioi-type.page';
import {
  AddIoiStatusPage
} from 'src/app/modals/add-ioi-status/add-ioi-status.page';
import {
  EditTabsIoiPage
} from 'src/app/modals/edit-tabs-ioi/edit-tabs-ioi.page';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import * as firebaseApp from 'firebase/app';
import {
  AddShortcutsPage
} from 'src/app/modals/add-shortcuts/add-shortcuts.page';
import {
  CreateSponsorCodePage
} from 'src/app/modals/create-sponsor-code/create-sponsor-code.page';
import { ViewOrgsPage } from 'src/app/modals/view-orgs/view-orgs.page';
@Component({
  selector: 'app-more-settings',
  templateUrl: './more-settings.page.html',
  styleUrls: ['./more-settings.page.scss'],
})
export class MoreSettingsPage implements OnInit {
  homeLabels: any = [];
  lat: any;
  lng: any;
  forms: any = [];
  formList: any = [];
  selectedForm: any;
  formOptions: any = [];
  addedToHomepage: any = [];
  organizations: any = [];
  organizationList: any = [];
  project: any;
  constructor(
    private alertController: AlertController,
    private uServ: UserService,
    private utils: UtilitiesService,
    private formService: FormService,
    private adminService: AdminService,
    private modalController: ModalController,
    private geolocation: Geolocation,
  ) {}

  userData: any;

  ngOnInit() {
    this.getUserData();
    this.getOrgs();
  }

  async getLatLng() {
    // const cars = this.afs.collection('cars');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async doRefresh(event) {
    await this.getUserData();
    await this.getOrgs();
    await this.getHomeLabels();
    event.target.complete();
  }


  getHomeLabels() {
    this.uServ.getHomeLabels().then((snap: any) => {
      this.homeLabels = snap.data();
    }).catch((err) => {
      this.utils.handleError(err);
    });
  }

  getOrgs() {
    this.organizationList = [];
    let orgSub = this.uServ.getOrgs().subscribe((res) => {
      this.organizations = res;
      res.map((org: any) => {
        this.organizationList.push({
          name: org.name,
          type: 'radio',
          label: org.name,
          value: org.orgId
        });
      })
      orgSub.unsubscribe();
    });
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then(async (userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        await this.getUserProject(userProfileSnapshot.data().orgId, userProfileSnapshot.data().projectId);
        this.getHomeLabels();
        this.getForms();
        this.getLatLng();
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  getUserProject(orgId, projId) {
    this.utils.presentLoading('');
    this.uServ.getProject(orgId, projId).subscribe((res) => {
      this.project = res;
      console.log(res);
      this.utils.dismissLoading();
    }, (err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
      console.log(err);
    });
  }


  /* ----------------------- Add an Incident Type Modal ----------------------- */

  async addIoiTypeModal() {

    const modal = await this.modalController.create({
      component: AddIoiTypePage,
      componentProps: {
        userData: this.userData
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Dismissed');
    });

    return await modal.present();
  }

  /* ------------------------------ Edit IOI Page ----------------------------- */

  async editIoiModal(id) {

    this.selectedForm = await this.forms.find(obj => {
      return obj.formId === id
    });

    console.log(this.selectedForm);

    const modal = await this.modalController.create({
      component: EditTabsIoiPage,
      componentProps: {
        selectedForm: this.selectedForm,
        physicalAddr: this.selectedForm.address,
        userData: this.userData,
        lat: this.lat,
        lng: this.lng
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        console.log(resp);
      }
    });

    return await modal.present();
  }

  /* --------------------------- Add IOI Status Page -------------------------- */

  async addIoiStatusModal() {

    const modal = await this.modalController.create({
      component: AddIoiStatusPage,
      componentProps: {
        userData: this.userData
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Dismissed');
    });

    return await modal.present();
  }


  /* ------------------------- Add IOI Shortcuts Page ------------------------- */


  async openAddIoiButtonsModal() {

    const modal = await this.modalController.create({
      component: AddShortcutsPage,
      componentProps: {
        userData: this.userData,
        userProject: this.project
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Dismissed');
    });

    return await modal.present();
  }

  async openSponsorModal() {

    const modal = await this.modalController.create({
      component: CreateSponsorCodePage,
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Dismissed');
    });

    return await modal.present();
  }

  /* ---------------------- Present Forms admin can edit ---------------------- */

  async presentNakedFormOptions() {
    const alert = await this.alertController.create({
      header: "Select Form",
      inputs: this.formList,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Select',
        handler: (selection: string) => {
          // console.log(selection);
          this.editIoiModal(selection);
          // this.formService.returnForm(selection, this.lat, this.lng);
        }
      }]
    });
    await alert.present();
  }


  /* ------------ Present options for admin to add to the homepage ------------ */

  /*   async presentNakedFormCheckboxes() {
      const alert = await this.alertController.create({
        header: "Add Shortcuts",
        inputs: this.formOptions,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Save',
          handler: (selection: string) => {
            // console.log(selection);
            // this.addedToHomepage.push(selection);
            this.addShortcutLinks(selection);
            // this.formService.returnForm(selection, this.lat, this.lng);
          }
        }]
      });
      await alert.present();
    } */

  /* --------------------- Form List is for edit form page -------------------- */

  setFormList() {
    this.forms.map((f) => {
      this.formList.push({
        name: f.formName,
        type: 'radio',
        label: f.formName,
        value: f.formId,
      });
    });
  }


  /* ------------- Form Options are for adding the shortcut links ------------- */

  /* setFormOptions() {
    this.forms.map((f) => {
      this.formOptions.push({
        name: f.formName,
        type: 'checkbox',
        label: f.formName,
        value: {
          formName: f.formName,
          formId: f.formId
        },
        checked: f.onHomePage
      });
    });
  } */


  /* ---------------------- Add Shortcut Link to Homepage --------------------- */

  /*   addShortcutLinks(forms) {
      this.utils.presentLoading('');
      this.formService.updateProject(this.userData.orgId, this.userData.projectId, {
        shortcutLinks: forms
      }).then(() => {
        this.utils.dismissLoading();
        this.utils.presentToast('Shortcuts updated successfully!', 'toast-success');
      }).catch((err) => {
        this.utils.dismissLoading();
        this.utils.handleError(err);
      });
    } */

  /* ------------------- Get All Ioi Forms in user's project ------------------ */

  getForms() {
    let formSub = this.formService.getAllForms(this.userData.project).subscribe((data) => {
      this.forms = (data);
      this.setFormList();
      formSub.unsubscribe();
    }, (err) => {
      this.utils.handleError(err);
    });
  }

  /* ----------------------------- Add What Field ----------------------------- */

  async addIncidentWhat() {
    const alert = await this.alertController.create({
      header: 'Add IOI What Field',
      inputs: [
        // multiline input.
        {
          name: 'it',
          id: 'it',
          type: 'text',
          placeholder: 'Enter here...'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
        }
      }, {
        text: 'Ok',
        handler: (data: any) => {
          var dateTime = new Date().toLocaleString();
          this.formService.uploadSRWhat({
            organization: this.userData.organization,
            project: this.userData.project,
            orgId: this.userData.orgId,
            name: data.it,
            when: dateTime,
            createdBy: `${this.userData.fullName} (${this.userData.email})`
          }).then(() => {
            this.utils.presentToast('IOI What Field Added Successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });
    return await alert.present()
  }


  /* ------------------------------ Add a project ----------------------------- */

  async addProject() {
    const alert = await this.alertController.create({
      header: 'Add New Project',
      inputs: [{
        name: 'project_name',
        id: 'it',
        type: 'text',
        placeholder: 'Enter here...'
      }, ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
        }
      }, {
        text: 'Add',
        handler: (data: any) => {
          var dateTime = new Date().toLocaleString();
          this.adminService.addProject(this.userData.orgId, {
            name: data.project_name,
            plansEnabled: true,
            ioiEnabled: true,
            myStatusEnabled: true,
            spotEnabled: true,
            siteStatusEnabled: true,
            when: dateTime,
            createdBy: `${this.userData.fullName} (${this.userData.email})`,
          }).then(() => {
            this.utils.presentToast('A new project has been created successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });
    return await alert.present()
  }


  /* ------------------------------ Add an organization ----------------------------- */

  async addOrganization() {
    const alert = await this.alertController.create({
      header: 'Add New Organization',
      inputs: [{
        name: 'org_name',
        id: 'it',
        type: 'text',
        placeholder: 'Enter here...'
      }, ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
        }
      }, {
        text: 'Add',
        handler: (data: any) => {
          var dateTime = new Date().toLocaleString();
          this.adminService.addOrganization({
            name: data.org_name,
            divisions: [],
            createdBy: `${this.userData.fullName} (${this.userData.email})`,
          }).then(() => {
            this.utils.presentToast('A new organization has been created successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });
    return await alert.present()
  }


  /* ------------------------------ Add an organization ----------------------------- */

  async addDivision() {

    const alert = await this.alertController.create({
      header: 'Add New Division',
      inputs: [{
        name: 'org_name',
        id: 'it',
        type: 'text',
        placeholder: 'Division Name...'
      }, ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
        }
      }, {
        text: 'Add',
        handler: (data: any) => {
          this.toWhichOrgModal(data.org_name);
        }
      }]
    });
    return await alert.present();
  }

  async viewOrgsModal() {

    const modal = await this.modalController.create({
      component: ViewOrgsPage,
      componentProps: {
        userData: this.userData
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      console.log('Dismissed');
    });

    return await modal.present();
  }

  async toWhichOrgModal(divisionName) {
    const alert = await this.alertController.create({
      header: 'To which organization?',
      inputs: this.organizationList,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (orgId) => {
          console.log(orgId);
          let org = this.organizations.find((obj) => {
            return obj.orgId === orgId;
          });
          org.divisions.push(divisionName);
          this.adminService.addDivision(orgId, org).then(() => {
            this.utils.presentToast('A new division has been created within the organization successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });
    await alert.present();
  }

  /* ------------ Change which buttons are visible on the homepage ------------ */

  async changeButtons() {
    const alert = await this.alertController.create({
      header: 'Home Buttons',
      inputs: [{
          name: 'myStatus',
          type: 'checkbox',
          label: 'My Status',
          value: 'myStatus',
          checked: this.homeLabels.myStatusEnabled
        },
        {
          name: 'myIoi',
          type: 'checkbox',
          label: 'Edit Form',
          value: 'myIoi',
          checked: this.homeLabels.myIoiEnabled
        },
        {
          name: 'createIoi',
          type: 'checkbox',
          label: 'Create IOI',
          value: 'createIoi',
          checked: this.homeLabels.createIoiEnabled
        },
        {
          name: 'myPlans',
          type: 'checkbox',
          label: 'My Plans',
          value: 'myPlans',
          checked: this.homeLabels.myPlansEnabled
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Save',
        handler: (data: any) => {
          let arr = data;
          console.log(arr);
          let obj: any = {};
          if (arr.includes("myIoi")) {
            obj.myIoiEnabled = true
          } else {
            obj.myIoiEnabled = false;
          }
          if (arr.includes("myStatus")) {
            obj.myStatusEnabled = true;
          } else {
            obj.myStatusEnabled = false;
          }
          if (arr.includes("myPlans")) {
            obj.myPlansEnabled = true
          } else {
            obj.myPlansEnabled = false;
          }
          if (arr.includes("createIoi")) {
            obj.createIoiEnabled = true
          } else {
            obj.createIoiEnabled = false;
          }
          console.log(obj);
          this.adminService.updateHomeButtons(obj).then(() => {
            this.utils.presentToast('Home Buttons Updated Successfully!', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          })
        }
      }]
    });

    await alert.present();
  }

  /* --------------------------- Adjust Home Labels --------------------------- */

  async changeHomeLabels() {
    let labels = [];
    const alert = await this.alertController.create({
      header: 'Change Home Button Labels',
      inputs: [{
          name: 'createIoi',
          type: 'text',
          value: this.homeLabels.createIoi,
          placeholder: 'Enter here...'
        },
        {
          name: 'myIoi',
          type: 'text',
          value: this.homeLabels.myIoi,
          placeholder: 'Enter here...'
        },
        {
          name: 'myStatus',
          type: 'text',
          value: this.homeLabels.myStatus,
          placeholder: 'Enter here...'
        },
        {
          name: 'myPlans',
          type: 'text',
          value: this.homeLabels.myPlans,
          placeholder: 'Enter here...'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
        }
      }, {
        text: 'Save',
        handler: (data: any) => {
          let newLabels = data;
          this.adminService.changeHomeLabels(newLabels).then(() => {
            this.utils.presentToast('Home Labels Updated Successfully.', 'toast-success');
          }).catch((err) => {
            this.utils.handleError(err);
          });
        }
      }]
    });
    return await alert.present()
  }

}