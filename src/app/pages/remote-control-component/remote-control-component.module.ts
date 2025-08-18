import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteControlComponentPageRoutingModule } from './remote-control-component-routing.module';

import { RemoteControlComponentPage } from './remote-control-component.page';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RemoteControlComponentPageRoutingModule
  ],
  declarations: [RemoteControlComponentPage]
})
export class RemoteControlComponentPageModule {}
