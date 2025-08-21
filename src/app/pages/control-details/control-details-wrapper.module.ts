import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDetailsWrapperPageRoutingModule } from './control-details-wrapper-routing.module';

import { ControlDetailsWrapperPage } from './control-details-wrapper.page';
import { ControlDetailTabsPageModule } from './control-detail-tabs/control-detail-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDetailTabsPageModule,
    ControlDetailsWrapperPageRoutingModule
  ],
  declarations: [ControlDetailsWrapperPage]
})
export class ControlDetailsWrapperPageModule {}
