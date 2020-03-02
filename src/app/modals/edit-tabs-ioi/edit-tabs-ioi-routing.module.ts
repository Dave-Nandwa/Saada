import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTabsIoiPage } from './edit-tabs-ioi.page';

const routes: Routes = [
  {
    path: '',
    component: EditTabsIoiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTabsIoiPageRoutingModule {}
