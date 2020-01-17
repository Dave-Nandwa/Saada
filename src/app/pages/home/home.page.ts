import { Component, OnInit } from '@angular/core';
import { services } from './../../emergencies';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  active: boolean = false;
  emergencies: any = services;
  constructor() { }

  ngOnInit() {
  }

  toggleClass(col) {
    this.emergencies.map((e) => e.active = false);
    col.active = true;
  }

}
