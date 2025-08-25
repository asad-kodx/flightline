import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlDetailTabsPage } from './control-detail-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDetailTabsPage,
    children: [
      {
        path: '',
        redirectTo: 'sensors',
        pathMatch: 'full',
      },
      {
        path: 'sensors',
        loadChildren: () => import('../sensor-list/tab-sensor-list.module')
          .then(m => m.TabSensorListPageModule)
      },
      {
        path: 'devices',
        loadChildren: () => import('../device-list/tabs-device-list.module')
          .then(m => m.TabsDeviceListPageModule)
      },
      {
        path: 'alarms',
        loadChildren: () => import('../alarm-list-tabs/alarm-list-tabs.module')
          .then(m => m.AlarmListTabsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDetailTabsPageRoutingModule {}
