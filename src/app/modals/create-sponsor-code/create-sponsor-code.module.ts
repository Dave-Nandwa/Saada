import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSponsorCodePageRoutingModule } from './create-sponsor-code-routing.module';

import { CreateSponsorCodePage } from './create-sponsor-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateSponsorCodePageRoutingModule
  ],
  declarations: [CreateSponsorCodePage]
})
export class CreateSponsorCodePageModule {}
