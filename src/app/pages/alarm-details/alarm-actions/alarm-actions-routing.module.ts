import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmActionsPage } from './alarm-actions.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmActionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmActionsPageRoutingModule {}
