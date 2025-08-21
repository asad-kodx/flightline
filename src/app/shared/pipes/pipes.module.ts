import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrgSearchPipe } from "./org-search/org-search.pipe";
import { AlarmStateOtherPipe, AlarmStateActivePipe } from "./alarmstatus/alarmstatus.pipe";
import { LiveValueDisplayPipe } from "./live-value/live-value.pipe";
import { OnlineFilter, OfflineFilter, FavoriteFilter, NonFavoriteFilter } from "./control-status/control-status.pipe";
import { CalibrationStatusPipe } from "./calibration-status/calibration-status.pipe";
import { ModePipe } from "./mode/mode.pipe";
import { EntityTypePipe } from "./entity-type/entity-type.pipe";
import { DeviceIconPipe } from "./device-icon/device-icon.pipe";
import { SensorDisplayIconPipe} from './sensor-icon/sensor-icon-pipe';

const pipes: any[] = [OrgSearchPipe, AlarmStateActivePipe, AlarmStateOtherPipe, LiveValueDisplayPipe, OnlineFilter, OfflineFilter, FavoriteFilter, NonFavoriteFilter, CalibrationStatusPipe, ModePipe, EntityTypePipe, DeviceIconPipe, SensorDisplayIconPipe];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class PipesModule {}