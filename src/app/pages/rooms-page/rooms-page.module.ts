import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPagePageRoutingModule } from './rooms-page-routing.module';

import { RoomsPagePage } from './rooms-page.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RoomsPagePageRoutingModule
  ],
  declarations: [RoomsPagePage]
})
export class RoomsPagePageModule {}
