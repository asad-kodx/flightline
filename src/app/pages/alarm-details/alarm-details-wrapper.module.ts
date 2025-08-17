import { AlarmDetailsTabPage } from './alarm-details-tab/alarm-details-tab.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmDetailsWrapperPageRoutingModule } from './alarm-details-wrapper-routing.module';

import { AlarmDetailsWrapperPage } from './alarm-details-wrapper.page';
import { AlarmDetailsTabPageModule } from "./alarm-details-tab/alarm-details-tab.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsWrapperPageRoutingModule,
    AlarmDetailsTabPageModule
],
  declarations: [AlarmDetailsWrapperPage,],
})
export class AlarmDetailsWrapperPageModule {}
