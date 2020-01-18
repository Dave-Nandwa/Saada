import {
  Injectable
} from '@angular/core';
import {
  ToastController,
  LoadingController
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  loader: any;
  isLoading = false;
  constructor(private toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  async presentToast(message, cssClass) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'top',
      animated: true,
      cssClass: cssClass
    });
    await toast.present();
  }

  async presentLoading(message) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: message,
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

}