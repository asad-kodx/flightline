import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlDetailsWrapperPage } from './control-details-wrapper.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDetailsWrapperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDetailsWrapperPageRoutingModule {}
