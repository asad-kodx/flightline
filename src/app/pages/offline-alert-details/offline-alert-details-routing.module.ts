import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineAlertDetailsPage } from './offline-alert-details.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineAlertDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineAlertDetailsPageRoutingModule {}
