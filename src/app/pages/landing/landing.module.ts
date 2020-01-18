import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';


import { NgxIntlTelInputModule, } from 'ngx-intl-tel-input';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LandingPageRoutingModule,
    FormsModule,
		ReactiveFormsModule,
		NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [LandingPage]
})
export class LandingPageModule {}
