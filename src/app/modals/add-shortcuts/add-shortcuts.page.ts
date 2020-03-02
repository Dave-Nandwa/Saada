import {
  FormService
} from './../../services/form.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  AngularFireStorage
} from '@angular/fire/storage';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-shortcuts',
  templateUrl: './add-shortcuts.page.html',
  styleUrls: ['./add-shortcuts.page.scss'],
})
export class AddShortcutsPage implements OnInit {

  userData;
  userProject;
  formList: any = [];
  loadedFormList: any = [];
  newShortcutList: any = [];
  constructor(
    private formService: FormService,
    private utils: UtilitiesService,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getForms();
    this.utils.presentAlert('INFO:','','Swipe list items that are not added right to add them to the home page. And Swipe Added List Items Right to Delete them.')
  }
  
  async deleteShortcut(formName) {
    let shortcutIndex = await this.userProject.shortcutLinks.findIndex((form) => {
      return form.formName === formName;
    });
    await this.userProject.shortcutLinks.splice(shortcutIndex, 1);
    console.log(this.userProject.shortcutLinks);
  }

  onReorder(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    let draggedItem = this.userProject.splice(event.detail.from, 1)[0];
    this.userProject.splice(event.detail.to, 0, draggedItem)
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }

  /* --------------------- Get All Forms in Users Project --------------------- */

  getForms() {
    this.utils.presentLoading('');
    let formSub = this.formService.getAllForms(this.userData.project).subscribe((data) => {
      this.utils.dismissLoading();
      this.formList = data;
      this.loadedFormList = data;
      console.log(data);
      formSub.unsubscribe();
    }, (err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  initializeItems(): void {
    this.formList = this.loadedFormList;
  }

  onSearchChange(e) {
    console.log(e.target.value);
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.formList = this.formList.filter(currentForm => {
      if (currentForm.formName && searchTerm) {
        if (currentForm.formName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  addToList(buttonName, formName, formId) {
    this.userProject.shortcutLinks.push({
      buttonName: buttonName,
      formName: formName,
      formId: formId
    });
  }

  async getButtonName(formId, formName) {
    const alert = await this.alertController.create({
      header: 'Input Button Name',
      inputs: [
        {
          name: 'btnName',
          type: 'text',
          placeholder: 'Button Name...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.addToList(data.btnName, formName, formId);
          }
        }
      ]
    });

    await alert.present();
  }

  addShortcutLinks() {
    this.utils.presentLoading('');
    this.formService.updateProject(this.userData.orgId, this.userData.projectId, {
      shortcutLinks: this.userProject.shortcutLinks
    }).then(() => {
      this.utils.dismissLoading();
      this.utils.presentToast('Shortcuts updated successfully!', 'toast-success').then(() => {
        this.modalCtrl.dismiss();
      }).catch((err) => this.modalCtrl.dismiss());
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
      this.modalCtrl.dismiss();
    });
  }

}