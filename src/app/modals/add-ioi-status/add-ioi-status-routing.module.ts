import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddIoiStatusPage } from './add-ioi-status.page';

const routes: Routes = [
  {
    path: '',
    component: AddIoiStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddIoiStatusPageRoutingModule {}
