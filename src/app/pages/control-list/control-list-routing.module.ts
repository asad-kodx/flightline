import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlListPage } from './control-list.page';

const routes: Routes = [
  {
    path: '',
    component: ControlListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlListPageRoutingModule {}
