import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteAlarmsListPageRoutingModule } from './site-alarms-list-routing.module';

import { SiteAlarmsListPage } from './site-alarms-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SiteAlarmsListPageRoutingModule
  ],
  declarations: [SiteAlarmsListPage]
})
export class SiteAlarmsListPageModule {}
