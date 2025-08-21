import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabSensorListPageRoutingModule } from './tab-sensor-list-routing.module';

import { TabSensorListPage } from './tab-sensor-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabSensorListPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TabSensorListPage]
})
export class TabSensorListPageModule {}
