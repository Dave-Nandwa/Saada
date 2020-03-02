
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreSettingsPageRoutingModule } from './more-settings-routing.module';

import { MoreSettingsPage } from './more-settings.page';
import { AddIoiTypePageModule } from 'src/app/modals/add-ioi-type/add-ioi-type.module';
import { AddIoiStatusPageModule } from './../../modals/add-ioi-status/add-ioi-status.module';
import { EditTabsIoiPageModule } from 'src/app/modals/edit-tabs-ioi/edit-tabs-ioi.module';
import { AddShortcutsPageModule } from 'src/app/modals/add-shortcuts/add-shortcuts.module';
import { CreateSponsorCodePageModule } from 'src/app/modals/create-sponsor-code/create-sponsor-code.module';
import { ViewOrgsPageModule } from 'src/app/modals/view-orgs/view-orgs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoreSettingsPageRoutingModule,
    AddIoiTypePageModule,
    AddIoiStatusPageModule,
    EditTabsIoiPageModule,
    AddShortcutsPageModule,
    CreateSponsorCodePageModule,
    ViewOrgsPageModule
  ],
  declarations: [MoreSettingsPage]
})
export class MoreSettingsPageModule {}
