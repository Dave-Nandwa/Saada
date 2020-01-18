import {
  Component,
  OnInit
} from '@angular/core';
import {
  services
} from './../../emergencies';
import {
  CallNumber
} from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  active: boolean = false;
  emergencies: any = services;
  numberToCall: string = this.emergencies[0].tels[0];
  tried: any = [];
  index: number = 0;

  constructor(private callNumber: CallNumber) {}

  ngOnInit() {}

  toggleClass(service) {
    /* -------------------------- Set Column to Active -------------------------- */
    this.emergencies.map((e) => e.active = false);
    service.active = true
    /* --------------------------- Set Number To Call --------------------------- */
    if (this.tried.includes(this.numberToCall)) {
      this.index = this.index < service.tels.length ? this.index++ : 0;
      this.numberToCall = service.tels[this.index];
    } else {
      this.numberToCall = service.tels[this.index];
    }
    this.tried.push(this.numberToCall);
  }

  callResponder() {
    this.callNumber.callNumber(this.numberToCall, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}