import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoteControlComponentPage } from './remote-control-component.page';

const routes: Routes = [
  {
    path: '',
    component: RemoteControlComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoteControlComponentPageRoutingModule {}
