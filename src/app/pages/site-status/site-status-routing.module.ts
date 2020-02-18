import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteStatusPage } from './site-status.page';

const routes: Routes = [
  {
    path: '',
    component: SiteStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteStatusPageRoutingModule {}
