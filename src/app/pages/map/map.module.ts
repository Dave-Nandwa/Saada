import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';

// Angular Google Maps
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { SpotReportsPageModule } from 'src/app/modals/spot-reports/spot-reports.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7i8ihh6Z7YAHPSUJxjZ5U2krePN8-_ks'
    }),
    AgmDirectionModule,
    SpotReportsPageModule 
  ],
  declarations: [MapPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class MapPageModule {}
