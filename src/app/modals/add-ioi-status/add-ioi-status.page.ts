import {
  UtilitiesService
} from './../../services/utilities.service';
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
  FormService
} from 'src/app/services/form.service';
import {
  AdminService
} from 'src/app/services/admin.service';
import {
  AngularFirestore
} from '@angular/fire/firestore';


@Component({
  selector: 'app-add-ioi-status',
  templateUrl: './add-ioi-status.page.html',
  styleUrls: ['./add-ioi-status.page.scss'],
})
export class AddIoiStatusPage implements OnInit {

  userData;
  ioiStatuses: any;
  constructor(
    private alertController: AlertController,
    private uServ: UserService,
    private utils: UtilitiesService,
    private formService: FormService,
    private adminService: AdminService,
    private afs: AngularFirestore,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.utils.presentToast('Slide List Item to the right to delete an IOI Status.', 'toast-info');
    this.getIncidentStatuses();
  }

  closeModal() {
    this.modalController.dismiss();
  }


  async addIncidentStatus() {
    const alert = await this.alertController.create({
      header: 'Add IOI Status',
      inputs: [
        // multiline input.
        {
          name: 'it',
          id: 'it',
          type: 'text',
          placeholder: 'Enter Status here'
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
          this.formService.uploadSRStatus({
            organization: this.userData.organization,
            project: this.userData.project,
            orgId: this.userData.orgId,
            name: data.it,
            when: dateTime,
            createdBy: `${this.userData.fullName} (${this.userData.email})`
          }).then(() => {
            this.utils.presentToast('IOI Status Added Successfully.', 'toast-success');
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


  getIncidentStatuses() {
    this.utils.presentLoading('');
    let dSub = this.formService.getSRStatuses(this.userData.organization).subscribe((data) => {
      this.utils.dismissLoading();
      this.ioiStatuses = data;
      dSub.unsubscribe();
      console.log('D3');
    }, (err) => {
      this.utils.dismissLoading();
    });
  }

  deleteIoiStatus(id) {
    this.afs.doc(`incident_statuses/${id}`).delete().then(() => {
      this.utils.presentToast('Item deleted Successfully!', 'toast-success');
      this.getIncidentStatuses();
    });
  }

}