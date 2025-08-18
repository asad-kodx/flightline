import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmItemPage } from './alarm-item.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmItemPageRoutingModule {}
