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
  statusLabels: any;
  statusNotes: any = 'N/A';
  userData: any = {
    status: 'none'
  };
  personalStatus: any = 'n/a';
  constructor(
    private userService: UserService,
    private authService: AuthService,
    public modalController: ModalController,
    private utils: UtilitiesService,
    private alertController: AlertController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getLabels();
    this.getUserData();
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      this.utils.dismissLoading();
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.personalStatus = userProfileSnapshot.data().status;
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }
  radioChange(event) {
    console.log("rd change", event.detail);
    this.personalStatus = event.detail.value ? event.detail.value : this.userData.status;
    console.log(this.personalStatus);
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
      this.utils.handleError(err);
      this.utils.dismissLoading();
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