import { Component, OnInit } from '@angular/core';
import { services } from './../../emergencies';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})
export class OfflinePage implements OnInit {

  active: boolean = false;
  emergencies: any = services;
  numberToCall: string = "any";

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {}
  
  toggleClass(service) {
    this.emergencies.map((e) => e.active = false);
    service.active = true;
    this.numberToCall = service.tels[service.tels.shift()];
  }

  callResponder() {
    this.callNumber.callNumber(this.numberToCall, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
