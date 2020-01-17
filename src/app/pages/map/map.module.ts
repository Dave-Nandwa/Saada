import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';

// Angular Google Maps
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCnmJi_-KqIXYRFvvUBlktplp6HZXKiMFQ'
    }),
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
