import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpotReportPage } from './spot-report.page';

const routes: Routes = [
  {
    path: '',
    component: SpotReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpotReportPageRoutingModule {}
