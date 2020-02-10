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

  ngOnInit() {
    console.log(this.spotReports)
  }

  viewMap(userId) {
    this.modalCtrl.dismiss(userId);
  }

}
