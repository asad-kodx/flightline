import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntityGraphsPageRoutingModule } from './entity-graphs-routing.module';

import { EntityGraphsPage } from './entity-graphs.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntityGraphsPageRoutingModule,
    NgxChartsModule,
    SharedModule
  ],
  declarations: [EntityGraphsPage]
})
export class EntityGraphsPageModule {}
