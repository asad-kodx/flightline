import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmActionsPageRoutingModule } from './alarm-actions-routing.module';

import { AlarmActionsPage } from './alarm-actions.page';
import { PipesModule } from "../../../shared/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmActionsPageRoutingModule,
    PipesModule
],
  declarations: [AlarmActionsPage]
})
export class AlarmActionsPageModule {}
