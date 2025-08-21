import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntityAlarmsPageRoutingModule } from './entity-alarms-routing.module';

import { EntityAlarmsPage } from './entity-alarms.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntityAlarmsPageRoutingModule,
    SharedModule
  ],
  declarations: [EntityAlarmsPage]
})
export class EntityAlarmsPageModule {}
