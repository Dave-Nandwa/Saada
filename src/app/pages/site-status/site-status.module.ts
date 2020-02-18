import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteStatusPageRoutingModule } from './site-status-routing.module';

import { SiteStatusPage } from './site-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteStatusPageRoutingModule
  ],
  declarations: [SiteStatusPage]
})
export class SiteStatusPageModule {}
