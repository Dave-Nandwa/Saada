import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { StatusPageModule } from 'src/app/modals/status/status.module';
import { FillInIoiPageModule } from 'src/app/modals/fill-in-ioi/fill-in-ioi.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    StatusPageModule,
    FillInIoiPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
