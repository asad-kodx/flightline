import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmDetailsWrapperPage } from './alarm-details-wrapper.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmDetailsWrapperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmDetailsWrapperPageRoutingModule {}
