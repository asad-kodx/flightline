import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineAlertDetailsPageRoutingModule } from './offline-alert-details-routing.module';

import { OfflineAlertDetailsPage } from './offline-alert-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineAlertDetailsPageRoutingModule
  ],
  declarations: [OfflineAlertDetailsPage]
})
export class OfflineAlertDetailsPageModule {}
