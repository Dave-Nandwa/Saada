
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpotReportPageRoutingModule } from './spot-report-routing.module';
// Add Media Modal
import { AddMediaPageModule } from './../../modals/add-media/add-media.module';
import { SpotReportPage } from './spot-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpotReportPageRoutingModule,
    AddMediaPageModule
  ],
  declarations: [SpotReportPage]
})
export class SpotReportPageModule {}
