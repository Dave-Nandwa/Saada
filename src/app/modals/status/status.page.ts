import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from 'src/app/services/user.service';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  ModalController,
  AlertController
} from '@ionic/angular';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  segment: any = 'personal';
  personalStatus: any = "I'm Okay";
  statusLabels: any;
  statusNotes: any = 'N/A';
  constructor(
    private userService: UserService,
    private authService: AuthService,
    public modalController: ModalController,
    private utils: UtilitiesService,
    private alertController: AlertController) {}

  ngOnInit() {
    this.getLabels();
  }


  radioChange(event) {
    console.log("rd change", event.detail);
    this.personalStatus = event.detail.value;
  }

  async savePersonalStatus() {
    let user = await this.authService.getUser();
    this.userService.updateUser(user.uid, {
      status: this.personalStatus,
      statusNotes: this.statusNotes
    }).then(() => {
      this.utils.presentToast('Status Changed Successfully', 'toast-success');
      this.modalController.dismiss();
    }).catch((err) => {
      this.utils.handleError(err)
    });
  }

  getLabels() {
    this.utils.presentLoading('');
    this.userService.getStatusLabels().then((snap: any) => {
      this.statusLabels = snap.data();
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.handleError(err)
    });
  }

  async addNotes() {
    const alert = await this.alertController.create({
      header: 'Status Notes (Optional)',
      inputs: [
        // multiline input.
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'text',
          placeholder: 'Enter Status Notes Here...'
        }
      ],
      buttons: [{
        text: 'Skip',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Cancelled.');
          this.savePersonalStatus();
        }
      }, {
        text: 'Ok',
        handler: (data: any) => {
          this.statusNotes = (data.paragraph);
          this.savePersonalStatus();
        }
      }]
    });
    return await alert.present()
  }

  closeModal() {
    this.modalController.dismiss();
  }


}