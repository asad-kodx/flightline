import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmListTabsPage } from './alarm-list-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmListTabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmListTabsPageRoutingModule {}
