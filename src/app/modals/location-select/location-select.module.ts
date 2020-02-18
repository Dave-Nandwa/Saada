import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';


import { LocationSelectPageRoutingModule } from './location-select-routing.module';

import { LocationSelectPage } from './location-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7i8ihh6Z7YAHPSUJxjZ5U2krePN8-_ks'
    }),
    LocationSelectPageRoutingModule
  ],
  declarations: [LocationSelectPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    MarkerManager,
    GoogleMapsAPIWrapper
  ]
})
export class LocationSelectPageModule {}
