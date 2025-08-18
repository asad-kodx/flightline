import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmItemPageRoutingModule } from './alarm-item-routing.module';

import { AlarmItemPage } from './alarm-item.page';
import { SharedModule } from 'src/app/shared/shared.module';
// import { LiveValueDisplayPipe } from 'src/app/shared/pipes/live-value/live-value.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AlarmItemPageRoutingModule,
    AsyncPipe
  ],
  exports: [AlarmItemPage],
  declarations: [AlarmItemPage]
})
export class AlarmItemPageModule {}
