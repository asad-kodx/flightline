import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmDetailsTabPage } from './alarm-details-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmDetailsTabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmDetailsTabPageRoutingModule {}
