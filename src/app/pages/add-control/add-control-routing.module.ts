import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddControlPage } from './add-control.page';

const routes: Routes = [
  {
    path: '',
    component: AddControlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddControlPageRoutingModule {}
