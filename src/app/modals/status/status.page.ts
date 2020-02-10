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
  ModalController
} from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  segment: any = 'personal';
  personalStatus: any;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    public modalController: ModalController,
    private utils: UtilitiesService) {}

  ngOnInit() {}

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    console.log(this.segment)
  }

  radioChange(event) {
    console.log("rd change", event.detail);
    this.personalStatus = event.detail.value;
  }

  async savePersonalStatus() {
    let user = await this.authService.getUser();
    this.userService.updateUser(user.uid, {
      status: this.personalStatus
    }).then(() => {
      this.utils.presentToast('Status Changed Successfully', 'toast-success');
      this.modalController.dismiss();
    }).catch((err) => {
      this.utils.handleError(err)
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
  

}