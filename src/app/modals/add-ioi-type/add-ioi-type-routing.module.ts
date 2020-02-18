import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddIoiTypePage } from './add-ioi-type.page';

const routes: Routes = [
  {
    path: '',
    component: AddIoiTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddIoiTypePageRoutingModule {}
