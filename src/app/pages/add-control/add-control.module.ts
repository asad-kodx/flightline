import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddControlPageRoutingModule } from './add-control-routing.module';

import { AddControlPage } from './add-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddControlPageRoutingModule
  ],
  declarations: [AddControlPage]
})
export class AddControlPageModule {}
