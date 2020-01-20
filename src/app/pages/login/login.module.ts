import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';


import { NgxIntlTelInputModule, } from 'ngx-intl-tel-input';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginPageRoutingModule,
    FormsModule,
		ReactiveFormsModule,
		NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
