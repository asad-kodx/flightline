import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntityGraphsPageRoutingModule } from './entity-graphs-routing.module';

import { EntityGraphsPage } from './entity-graphs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntityGraphsPageRoutingModule
  ],
  declarations: [EntityGraphsPage]
})
export class EntityGraphsPageModule {}
