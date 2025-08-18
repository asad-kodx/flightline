import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsDeviceListPage } from './tabs-device-list.page';

const routes: Routes = [
  {
    path: '',
    component: TabsDeviceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsDeviceListPageRoutingModule {}
