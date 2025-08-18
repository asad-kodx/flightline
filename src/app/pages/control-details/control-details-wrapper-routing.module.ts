import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlDetailsWrapperPage } from './control-details-wrapper.page';

const routes: Routes = [
  {
    path: '',
    component: ControlDetailsWrapperPage
  },
  {
    path: 'control-detail-tabs',
    loadChildren: () => import('./control-detail-tabs/control-detail-tabs.module').then( m => m.ControlDetailTabsPageModule)
  },
  {
    path: 'tabs-device-list',
    loadChildren: () => import('./device-list/tabs-device-list.module').then( m => m.TabsDeviceListPageModule)
  },
  {
    path: 'entity-alarms',
    loadChildren: () => import('./entity-alarms/entity-alarms.module').then( m => m.EntityAlarmsPageModule)
  },
  {
    path: 'entity-graphs',
    loadChildren: () => import('./entity-graphs/entity-graphs.module').then( m => m.EntityGraphsPageModule)
  },
  {
    path: 'tab-sensor-list',
    loadChildren: () => import('./sensor-list/tab-sensor-list.module').then( m => m.TabSensorListPageModule)
  },
  {
    path: 'alarm-list-tabs',
    loadChildren: () => import('./alarm-list-tabs/alarm-list-tabs.module').then( m => m.AlarmListTabsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlDetailsWrapperPageRoutingModule {}
