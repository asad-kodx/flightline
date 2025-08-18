import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntityGraphsPage } from './entity-graphs.page';

const routes: Routes = [
  {
    path: '',
    component: EntityGraphsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityGraphsPageRoutingModule {}
