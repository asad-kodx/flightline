import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IgnoredControlsPageRoutingModule } from './ignored-controls-routing.module';

import { IgnoredControlsPage } from './ignored-controls.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IgnoredControlsPageRoutingModule
  ],
  declarations: [IgnoredControlsPage]
})
export class IgnoredControlsPageModule {}
