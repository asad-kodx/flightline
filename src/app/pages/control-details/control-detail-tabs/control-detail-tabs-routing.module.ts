import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlDetailTabsPage } from './control-detail-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDetailTabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDetailTabsPageRoutingModule {}
