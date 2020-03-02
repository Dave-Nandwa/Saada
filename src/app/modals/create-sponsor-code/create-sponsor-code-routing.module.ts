import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSponsorCodePage } from './create-sponsor-code.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSponsorCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSponsorCodePageRoutingModule {}
