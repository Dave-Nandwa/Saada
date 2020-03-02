import { FormlyFieldDescription } from './../../components/description/description';
import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  FormlyModule
} from '@ngx-formly/core';
import {
  FormlyIonicModule
} from '@ngx-formly/ionic';

import {
  IonicModule
} from '@ionic/angular';

import {
  FillInIoiPageRoutingModule
} from './fill-in-ioi-routing.module';

import {
  FillInIoiPage
} from './fill-in-ioi.page';
import {
  AddMediaPageModule
} from '../add-media/add-media.module';
import {
  LocationSelectPageModule
} from './../location-select/location-select.module';
import {
  MaterialModule
} from 'src/app/material.module';
import {
  FormlyFieldMultiCheckbox
} from 'src/app/components/multicheckbox/multicheckbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [{
        name: 'multicheckbox',
        component: FormlyFieldMultiCheckbox
      },
      {
        name: 'instruction',
        component: FormlyFieldDescription
      }]
    }),
    FormlyIonicModule,
    IonicModule,
    AddMediaPageModule,
    FillInIoiPageRoutingModule,
    LocationSelectPageModule,
    MaterialModule
  ],
  declarations: [FillInIoiPage, FormlyFieldMultiCheckbox, FormlyFieldDescription]
})
export class FillInIoiPageModule {}