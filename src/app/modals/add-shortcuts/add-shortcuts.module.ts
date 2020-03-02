import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddShortcutsPageRoutingModule } from './add-shortcuts-routing.module';

import { AddShortcutsPage } from './add-shortcuts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddShortcutsPageRoutingModule
  ],
  declarations: [AddShortcutsPage]
})
export class AddShortcutsPageModule {}
