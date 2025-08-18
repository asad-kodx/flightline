import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmListPageRoutingModule } from './alarm-list-routing.module';

import { AlarmListPage } from './alarm-list.page';
import { AlarmItemPage } from './alarm-item/alarm-item.page';
import { AlarmItemPageModule } from './alarm-item/alarm-item.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmListPageRoutingModule,
    ReactiveFormsModule,
    AlarmItemPageModule,
    SharedModule
  ],
  declarations: [AlarmListPage]
})
export class AlarmListPageModule {}
