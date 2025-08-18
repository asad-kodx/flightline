import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDetailTabsPageRoutingModule } from './control-detail-tabs-routing.module';

import { ControlDetailTabsPage } from './control-detail-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDetailTabsPageRoutingModule
  ],
  exports: [ControlDetailTabsPage],
  declarations: [ControlDetailTabsPage]
})
export class ControlDetailTabsPageModule {}
