import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDivisionsPageRoutingModule } from './view-divisions-routing.module';

import { ViewDivisionsPage } from './view-divisions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDivisionsPageRoutingModule
  ],
  declarations: [ViewDivisionsPage]
})
export class ViewDivisionsPageModule {}
