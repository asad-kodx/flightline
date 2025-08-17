import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteControlComponentPageRoutingModule } from './remote-control-component-routing.module';

import { RemoteControlComponentPage } from './remote-control-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemoteControlComponentPageRoutingModule
  ],
  declarations: [RemoteControlComponentPage]
})
export class RemoteControlComponentPageModule {}
