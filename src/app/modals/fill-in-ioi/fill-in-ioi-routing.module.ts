import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FillInIoiPage } from './fill-in-ioi.page';

const routes: Routes = [
  {
    path: '',
    component: FillInIoiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FillInIoiPageRoutingModule {}
