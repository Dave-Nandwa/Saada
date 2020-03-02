import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';
 
import { IonicModule } from '@ionic/angular';

import { StepFormPageRoutingModule } from './step-form-routing.module';

import { StepFormPage } from './step-form.page';
import { MaterialModule } from 'src/app/material.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepFormPageRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyIonicModule,
    MaterialModule
  ],
  declarations: [StepFormPage]
})
export class StepFormPageModule {}
