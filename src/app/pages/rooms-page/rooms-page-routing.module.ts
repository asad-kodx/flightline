import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomsPagePage } from './rooms-page.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsPagePageRoutingModule {}
