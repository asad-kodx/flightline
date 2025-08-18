import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmListTabsPageRoutingModule } from './alarm-list-tabs-routing.module';

import { AlarmListTabsPage } from './alarm-list-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmListTabsPageRoutingModule
  ],
  declarations: [AlarmListTabsPage]
})
export class AlarmListTabsPageModule {}
