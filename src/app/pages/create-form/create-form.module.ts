
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';

import { IonicModule, ModalController } from '@ionic/angular';

import { CreateFormPageRoutingModule } from './create-form-routing.module';

import { CreateFormPage } from './create-form.page';
import { LocationSelectPageModule } from './../../modals/location-select/location-select.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateFormPageRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyIonicModule,
    LocationSelectPageModule
  ],
  declarations: [CreateFormPage]
})
export class CreateFormPageModule {}
