import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlarmGroupMembersPageRoutingModule } from './alarm-group-members-routing.module';

import { AlarmGroupMembersPage } from './alarm-group-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmGroupMembersPageRoutingModule
  ],
  declarations: [AlarmGroupMembersPage]
})
export class AlarmGroupMembersPageModule {}
