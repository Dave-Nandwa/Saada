import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import { FormlyIonicModule } from '@ngx-formly/ionic';

import { IonicModule } from '@ionic/angular';

import { EditTabsIoiPageRoutingModule } from './edit-tabs-ioi-routing.module';

import { EditTabsIoiPage } from './edit-tabs-ioi.page';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTabsIoiPageRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyIonicModule,
    MaterialModule
  ],
  declarations: [EditTabsIoiPage]
})
export class EditTabsIoiPageModule {}
