import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmDetailsTabPageRoutingModule } from './alarm-details-tab-routing.module';

import { AlarmDetailsTabPage } from './alarm-details-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsTabPageRoutingModule
  ],
  exports: [AlarmDetailsTabPage],
  declarations: [AlarmDetailsTabPage]
})
export class AlarmDetailsTabPageModule {}
