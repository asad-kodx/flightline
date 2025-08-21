import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsDeviceListPageRoutingModule } from './tabs-device-list-routing.module';

import { TabsDeviceListPage } from './tabs-device-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TabsDeviceListPageRoutingModule,
    SharedModule
  ],
  declarations: [TabsDeviceListPage]
})
export class TabsDeviceListPageModule {}
