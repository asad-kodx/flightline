import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteAlarmsListPage } from './site-alarms-list.page';

const routes: Routes = [
  {
    path: '',
    component: SiteAlarmsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteAlarmsListPageRoutingModule {}
