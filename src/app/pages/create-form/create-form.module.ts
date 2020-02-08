
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';

import { IonicModule } from '@ionic/angular';

import { CreateFormPageRoutingModule } from './create-form-routing.module';

import { CreateFormPage } from './create-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateFormPageRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyIonicModule
  ],
  declarations: [CreateFormPage]
})
export class CreateFormPageModule {}
