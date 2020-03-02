import { UtilitiesService } from './../../services/utilities.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { FormService } from 'src/app/services/form.service';
import { AdminService } from 'src/app/services/admin.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-ioi-type',
  templateUrl: './add-ioi-type.page.html',
  styleUrls: ['./add-ioi-type.page.scss'],
})
export class AddIoiTypePage implements OnInit {
  userData;
  ioiTypes: any;
  constructor(
    private alertController: AlertController,
    private uServ: UserService,
    private utils: UtilitiesService,
    private formService: FormService,
    private adminService: AdminService,
    private afs: AngularFirestore,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.utils.presentToast('Slide List Item to the right to delete an IOI Type.', 'toast-info');
    console.log(this.userData);
    setTimeout(() => {
      this.getIncidentTypes();
    }, 1000)
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async addIncidentType() {
    const alert = await this.alertController.create({
      header: 'Add Incident Type',
      inputs: [
        // multiline input.
        {
          name: 'it',
          id: 'it',
          type: 'text',
          placeholder: 'Enter Type here'
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
          this.formService.uploadIncidentType({
            organization: this.userData.organization,
            project: this.userData.project,
            orgId: this.userData.orgId,
            name: data.it,
            when: dateTime,
            createdBy: `${this.userData.fullName} (${this.userData.email})`
          }).then(() => {
            this.utils.presentToast('Incident Type Added Successfully.', 'toast-success');
            this.modalController.dismiss();
          }).catch((err) => {
            this.utils.handleError(err);
            this.modalController.dismiss();
          });
        }
      }]
    });
    return await alert.present()
  }

  getIncidentTypes() {
     this.utils.presentLoading('');
    let dSub = this.formService.getIncidentTypes(this.userData.organization).subscribe((data) => {
      this.utils.dismissLoading();
      this.ioiTypes = data;
      dSub.unsubscribe();
      console.log('D3');
    }, (err) => {
      this.utils.handleError(err);
      this.utils.dismissLoading();
    });
  }

  deleteIoiType(id) {
    this.afs.doc(`incident_types/${id}`).delete().then(() => {
      this.utils.presentToast('Item deleted Successfully!', 'toast-success');
      this.getIncidentTypes();
    });
  }


}
