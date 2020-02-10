import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpotReportsPageRoutingModule } from './spot-reports-routing.module';

import { SpotReportsPage } from './spot-reports.page';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    SpotReportsPageRoutingModule
  ],
  declarations: [SpotReportsPage]
})
export class SpotReportsPageModule {}
