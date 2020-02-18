
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyFormsPageRoutingModule } from './my-forms-routing.module';

import { MyFormsPage } from './my-forms.page';
import { FillInIoiPageModule } from 'src/app/modals/fill-in-ioi/fill-in-ioi.module';
import { EditIoiPageModule } from './../../modals/edit-ioi/edit-ioi.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyFormsPageRoutingModule,
    FillInIoiPageModule,
    EditIoiPageModule
  ],
  declarations: [MyFormsPage]
})
export class MyFormsPageModule {}
