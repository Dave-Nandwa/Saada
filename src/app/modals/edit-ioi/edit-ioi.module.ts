import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditIoiPageRoutingModule } from './edit-ioi-routing.module';

import { EditIoiPage } from './edit-ioi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditIoiPageRoutingModule
  ],
  declarations: [EditIoiPage]
})
export class EditIoiPageModule {}
