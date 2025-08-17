import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmDetailsWrapperPage } from './alarm-details-wrapper.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmDetailsWrapperPage
  },
  {
    path: 'alarm-details-tab',
    loadChildren: () => import('./alarm-details-tab/alarm-details-tab.module').then( m => m.AlarmDetailsTabPageModule)
  },
  {
    path: 'alarm-actions',
    loadChildren: () => import('./alarm-actions/alarm-actions.module').then( m => m.AlarmActionsPageModule)
  },
  {
    path: 'alarm-group-members',
    loadChildren: () => import('./alarm-group-members/alarm-group-members.module').then( m => m.AlarmGroupMembersPageModule)
  },
  {
    path: 'alarm-history',
    loadChildren: () => import('./alarm-history/alarm-history.module').then( m => m.AlarmHistoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmDetailsWrapperPageRoutingModule {}
