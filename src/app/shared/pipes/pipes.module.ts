import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrgSearchPipe } from "./org-search/org-search.pipe";
import { AlarmStateOtherPipe, AlarmStateActivePipe } from "./alarmstatus/alarmstatus.pipe";
import { LiveValueDisplayPipe } from "./live-value/live-value.pipe";

const pipes: any[] = [OrgSearchPipe, AlarmStateActivePipe, AlarmStateOtherPipe, LiveValueDisplayPipe];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class PipesModule {}