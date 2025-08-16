import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IgnoredControlsPage } from './ignored-controls.page';

const routes: Routes = [
  {
    path: '',
    component: IgnoredControlsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IgnoredControlsPageRoutingModule {}
