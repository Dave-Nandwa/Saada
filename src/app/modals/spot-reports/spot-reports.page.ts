import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-spot-reports',
  templateUrl: './spot-reports.page.html',
  styleUrls: ['./spot-reports.page.scss'],
})
export class SpotReportsPage implements OnInit {

  constructor(
    public modalCtrl: ModalController
  ) { }

  spotReports;
  nakedReports;
  ngOnInit() {
    console.log(this.spotReports)
    console.log(this.nakedReports);
  }

  viewMap(userId) {
    this.modalCtrl.dismiss(userId);
  }

  closeModal() {
    this.modalCtrl.dismiss('');
  }

}
