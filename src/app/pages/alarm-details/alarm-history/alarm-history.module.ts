import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmHistoryPageRoutingModule } from './alarm-history-routing.module';

import { AlarmHistoryPage } from './alarm-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmHistoryPageRoutingModule
  ],
  declarations: [AlarmHistoryPage]
})
export class AlarmHistoryPageModule {}
