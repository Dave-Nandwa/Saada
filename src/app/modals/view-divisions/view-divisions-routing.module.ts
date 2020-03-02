import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDivisionsPage } from './view-divisions.page';

const routes: Routes = [
  {
    path: '',
    component: ViewDivisionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDivisionsPageRoutingModule {}
