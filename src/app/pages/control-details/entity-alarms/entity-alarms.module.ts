import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntityAlarmsPageRoutingModule } from './entity-alarms-routing.module';

import { EntityAlarmsPage } from './entity-alarms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntityAlarmsPageRoutingModule
  ],
  declarations: [EntityAlarmsPage]
})
export class EntityAlarmsPageModule {}
