import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyFormsPage } from './my-forms.page';

const routes: Routes = [
  {
    path: '',
    component: MyFormsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyFormsPageRoutingModule {}
