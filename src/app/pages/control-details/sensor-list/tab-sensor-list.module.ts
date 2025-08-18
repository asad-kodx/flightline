import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabSensorListPageRoutingModule } from './tab-sensor-list-routing.module';

import { TabSensorListPage } from './tab-sensor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabSensorListPageRoutingModule
  ],
  declarations: [TabSensorListPage]
})
export class TabSensorListPageModule {}
