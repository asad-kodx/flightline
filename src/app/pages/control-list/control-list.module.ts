import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlListPageRoutingModule } from './control-list-routing.module';

import { ControlListPage } from './control-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ControlListPageRoutingModule
  ],
  declarations: [ControlListPage]
})
export class ControlListPageModule {}
