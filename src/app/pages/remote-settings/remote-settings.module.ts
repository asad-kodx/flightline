import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteSettingsPageRoutingModule } from './remote-settings-routing.module';

import { RemoteSettingsPage } from './remote-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemoteSettingsPageRoutingModule
  ],
  declarations: [RemoteSettingsPage]
})
export class RemoteSettingsPageModule {}
