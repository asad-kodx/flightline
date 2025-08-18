import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsDeviceListPageRoutingModule } from './tabs-device-list-routing.module';

import { TabsDeviceListPage } from './tabs-device-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsDeviceListPageRoutingModule
  ],
  declarations: [TabsDeviceListPage]
})
export class TabsDeviceListPageModule {}
