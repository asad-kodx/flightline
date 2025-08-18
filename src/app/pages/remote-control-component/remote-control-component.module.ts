import { CalibrationStatusPipe } from './../../shared/pipes/calibration-status/calibration-status.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteControlComponentPageRoutingModule } from './remote-control-component-routing.module';

import { RemoteControlComponentPage } from './remote-control-component.page';
import { LiveValueDisplayPipe } from 'src/app/shared/pipes/live-value/live-value.pipe';
import { ModePipe } from 'src/app/shared/pipes/mode/mode.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemoteControlComponentPageRoutingModule
  ],
  declarations: [RemoteControlComponentPage, LiveValueDisplayPipe, CalibrationStatusPipe, ModePipe]
})
export class RemoteControlComponentPageModule {}
