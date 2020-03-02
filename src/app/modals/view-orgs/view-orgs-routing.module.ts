import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewOrgsPage } from './view-orgs.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOrgsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOrgsPageRoutingModule {}
