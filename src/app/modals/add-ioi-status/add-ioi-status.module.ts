import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddIoiStatusPageRoutingModule } from './add-ioi-status-routing.module';

import { AddIoiStatusPage } from './add-ioi-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddIoiStatusPageRoutingModule
  ],
  declarations: [AddIoiStatusPage]
})
export class AddIoiStatusPageModule {}
