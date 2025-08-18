import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabSensorListPage } from './tab-sensor-list.page';

const routes: Routes = [
  {
    path: '',
    component: TabSensorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabSensorListPageRoutingModule {}
