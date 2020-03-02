import { AdminService } from 'src/app/services/admin.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ModalController } from '@ionic/angular';
import { ViewDivisionsPage } from '../view-divisions/view-divisions.page';

@Component({
  selector: 'app-view-orgs',
  templateUrl: './view-orgs.page.html',
  styleUrls: ['./view-orgs.page.scss'],
})
export class ViewOrgsPage implements OnInit {
  private organizationsCollection: AngularFirestoreCollection < any > ;
  organizationsSub: Observable < any[] > ;
  organizations: any = [];
  organization: any;
  constructor(
    private afs: AngularFirestore,
    private utils: UtilitiesService,
    private modalCtrl: ModalController,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.utils.presentToast('Swipe list item to the right for more options.', 'toast-info');
  }

  ionViewDidEnter() {
    this.getOrgs();
  }

  getOrgs() {
    this.organizationsCollection = this.afs.collection('organizations');
    this.organizationsSub = this.organizationsCollection.valueChanges();
    let orgSub = this.organizationsSub.subscribe((res) => {
      this.organizations = res;
      this.organization = res[0];
    });
  }

  async viewDivs(orgId) {
    let org = this.organizations.find((org) => {
      return org.orgId === orgId
    });
    console.log(org);

    const modal = await this.modalCtrl.create({
      component: ViewDivisionsPage,
      componentProps: {
        divisions: org.divisions
      }
    });

    modal.onDidDismiss().then((resp: any) => {
      if (resp.data) {
        this.organization.divisions = resp.data.divisions;
        this.adminService.updateOrg(orgId, this.organization).then(() => {
          this.utils.presentToast('Division updated Successfully!', 'toast-success');
        });
      }
    });

    return await modal.present();
  }

  delete(orgId) {
    this.adminService.deleteOrg(orgId).then(() => {
      this.utils.presentToast('Organization Deleted Successfully!', 'toast-success');
      this.modalCtrl.dismiss();
    }).catch((err) => {
      this.utils.handleError(err)
      console.log(err);
    })
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
