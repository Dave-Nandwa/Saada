import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOrgsPageRoutingModule } from './view-orgs-routing.module';

import { ViewOrgsPage } from './view-orgs.page';
import { ViewDivisionsPageModule } from '../view-divisions/view-divisions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOrgsPageRoutingModule,
    ViewDivisionsPageModule
  ],
  declarations: [ViewOrgsPage]
})
export class ViewOrgsPageModule {}
