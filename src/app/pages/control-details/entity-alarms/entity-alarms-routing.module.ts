import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntityAlarmsPage } from './entity-alarms.page';

const routes: Routes = [
  {
    path: '',
    component: EntityAlarmsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityAlarmsPageRoutingModule {}
