import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPagePageRoutingModule } from './rooms-page-routing.module';

import { RoomsPagePage } from './rooms-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomsPagePageRoutingModule
  ],
  declarations: [RoomsPagePage]
})
export class RoomsPagePageModule {}
