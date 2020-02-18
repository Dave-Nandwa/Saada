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

@Component({
  selector: 'app-more-settings',
  templateUrl: './more-settings.page.html',
  styleUrls: ['./more-settings.page.scss'],
})
export class MoreSettingsPage implements OnInit {
  homeLabels: any = [];
  constructor(
    private alertController: AlertController,
    private uServ: UserService,
    private utils: UtilitiesService,
    private formService: FormService,
    private adminService: AdminService,
    private modalController: ModalController
  ) {}

  userData: any;

  ngOnInit() {
    this.getUserData();
  }

  async doRefresh(event) {
    await this.getUserData();
    event.target.complete();
  }


  getHomeLabels() {
    this.utils.presentLoading('');
    this.uServ.getHomeLabels().then((snap: any) => {
      this.homeLabels = snap.data();
      console.log(snap.data());
    }).catch((err) => {
      this.utils.handleError(err);
      this.utils.dismissLoading();
    });
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.getHomeLabels();
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  async addIoiModal() {

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
          this.formService.addProject(this.userData.orgId, {
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

  async changeButtons() {
    const alert = await this.alertController.create({
      header: 'Home Buttons',
      inputs: [{
          name: 'myStatus',
          type: 'checkbox',
          label: 'My Status',
          value: 'myStatus',
        },
        {
          name: 'myIoi',
          type: 'checkbox',
          label: 'My IOI',
          value: 'myIoi',
        },
        {
          name: 'createIoi',
          type: 'checkbox',
          label: 'Create IOI',
          value: 'createIoi',
        },
        {
          name: 'myPlans',
          type: 'checkbox',
          label: 'My Plans',
          value: 'myPlans',
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