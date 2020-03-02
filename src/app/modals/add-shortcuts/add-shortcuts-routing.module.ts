import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddShortcutsPage } from './add-shortcuts.page';

const routes: Routes = [
  {
    path: '',
    component: AddShortcutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddShortcutsPageRoutingModule {}
