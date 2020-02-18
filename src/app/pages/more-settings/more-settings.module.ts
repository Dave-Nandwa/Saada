
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreSettingsPageRoutingModule } from './more-settings-routing.module';

import { MoreSettingsPage } from './more-settings.page';
import { AddIoiTypePageModule } from 'src/app/modals/add-ioi-type/add-ioi-type.module';
import { AddIoiStatusPageModule } from './../../modals/add-ioi-status/add-ioi-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreSettingsPageRoutingModule,
    AddIoiTypePageModule,
    AddIoiStatusPageModule,
  ],
  declarations: [MoreSettingsPage]
})
export class MoreSettingsPageModule {}
