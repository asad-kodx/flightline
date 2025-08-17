import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmHistoryPage } from './alarm-history.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmHistoryPageRoutingModule {}
