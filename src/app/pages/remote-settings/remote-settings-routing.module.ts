import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoteSettingsPage } from './remote-settings.page';

const routes: Routes = [
  {
    path: '',
    component: RemoteSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoteSettingsPageRoutingModule {}
