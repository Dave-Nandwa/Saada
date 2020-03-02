import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-divisions',
  templateUrl: './view-divisions.page.html',
  styleUrls: ['./view-divisions.page.scss'],
})
export class ViewDivisionsPage implements OnInit {
  divisions;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }
  delete(index) {
    this.divisions.splice(index, 1);

  }

  save() {
    this.modalCtrl.dismiss({
      divisions: this.divisions
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
