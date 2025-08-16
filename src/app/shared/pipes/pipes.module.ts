import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrgSearchPipe } from "./org-search/org-search.pipe";
import { AlarmStateOtherPipe, AlarmStateActivePipe } from "./alarmstatus/alarmstatus.pipe";
import { LiveValueDisplayPipe } from "./live-value/live-value.pipe";
import { OnlineFilter, OfflineFilter, FavoriteFilter, NonFavoriteFilter } from "./control-status/control-status.pipe";

const pipes: any[] = [OrgSearchPipe, AlarmStateActivePipe, AlarmStateOtherPipe, LiveValueDisplayPipe, OnlineFilter, OfflineFilter, FavoriteFilter, NonFavoriteFilter];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class PipesModule {}