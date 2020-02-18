import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddIoiTypePageRoutingModule } from './add-ioi-type-routing.module';

import { AddIoiTypePage } from './add-ioi-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddIoiTypePageRoutingModule
  ],
  declarations: [AddIoiTypePage]
})
export class AddIoiTypePageModule {}
