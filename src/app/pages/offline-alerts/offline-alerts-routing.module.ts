import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineAlertsPage } from './offline-alerts.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineAlertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineAlertsPageRoutingModule {}
