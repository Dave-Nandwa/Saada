import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpotReportsPage } from './spot-reports.page';

const routes: Routes = [
  {
    path: '',
    component: SpotReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpotReportsPageRoutingModule {}
