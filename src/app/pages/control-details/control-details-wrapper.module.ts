import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlDetailsWrapperPageRoutingModule } from './control-details-wrapper-routing.module';

import { ControlDetailsWrapperPage } from './control-details-wrapper.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlDetailsWrapperPageRoutingModule,
    ControlDetailsWrapperPage
  ],
  declarations: [ControlDetailsWrapperPage]
})
export class ControlDetailsWrapperPageModule {}
