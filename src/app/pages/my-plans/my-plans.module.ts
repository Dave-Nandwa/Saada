import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPlansPageRoutingModule } from './my-plans-routing.module';

import { MyPlansPage } from './my-plans.page';
import { AccordionComponent } from 'src/app/components/accordion/accordion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPlansPageRoutingModule
  ],
  declarations: [MyPlansPage, AccordionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyPlansPageModule {}
