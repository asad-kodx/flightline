import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineAlertsPageRoutingModule } from './offline-alerts-routing.module';

import { OfflineAlertsPage } from './offline-alerts.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineAlertsPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [OfflineAlertsPage],
})
export class OfflineAlertsPageModule {}
