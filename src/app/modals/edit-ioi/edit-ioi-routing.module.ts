import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditIoiPage } from './edit-ioi.page';

const routes: Routes = [
  {
    path: '',
    component: EditIoiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditIoiPageRoutingModule {}
