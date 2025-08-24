import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { SiteContextService } from 'src/app/core/services/site-context.service';
import { ControlAlarm, EntityType, AlarmState, DBKeys } from 'src/app/shared/models';
import { LiveValueDisplayPipe } from 'src/app/shared/pipes/live-value/live-value.pipe';
@Component({
  selector: 'app-alarm-item',
  templateUrl: './alarm-item.page.html',
  styleUrls: ['./alarm-item.page.scss'],
  standalone: false
})
export class AlarmItemPage {

@Input('alarms') alarms: Observable<ControlAlarm[]>;
    @Input('resolved') resolved: boolean = false;
    @Input('searchText') searchText!: string;
    @Input('mine') mine!: boolean;

    entityType!: EntityType;

    protected liveValuesMap: Observable<Map<string, any>>;

    constructor(private navCtrl: NavController, private liveValuesService: LiveValueService, private siteContext: SiteContextService, 
        public roomData: RoomDataProvider, public controlData: ControlDataProvider) {
        this.alarms = from([]);
        this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
    }

    public alarmStateColor(alarm: ControlAlarm) {
        if(alarm.state != AlarmState.Resolved && alarm.silent) return 'primary';
        switch (alarm.state) {
            case AlarmState.Active:
                return 'alarm0';
            case AlarmState.Acknowledged:
                return 'alarm1';
            case AlarmState.Resolved:
                return 'alarm2';
            default:
                return 'facebook';
        }
    }

    public navigateToDetails(alarm: ControlAlarm) {
        console.log('Navigate to Details', alarm);
        this.navCtrl.navigateForward('alarm-details/alarm-actions', { queryParams: { alarm }});
    }

    shouldShow(alarm: ControlAlarm): boolean {
        if(!this.isMine(alarm)) return false;
        if(!this.siteContext.isSiteSelected(alarm.siteId)) return false;
        if (!this.searchText || this.searchText.trim() == "" || !alarm) return true;
        return (alarm.description.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            alarm.controlName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            alarm.controlSerialNumber.toString().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            (alarm.entityName? alarm.entityName : "").toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            alarm.roomName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            (alarm.entityHardwareId? alarm.entityHardwareId : "").indexOf(this.searchText.toLocaleLowerCase()) > -1);
    }

    isMine(alarm: ControlAlarm){
        if(!this.mine) return true;
        var valid = false;
        if(!alarm.alarmGroup) return true;
        if(alarm.alarmGroup.members.length > 10){
            var member = alarm.alarmGroup.members.find(agm => agm.userId == alarm.assignedToId);
            var myUser = alarm.alarmGroup.members.find(agm => agm.userId == localStorage.getItem('user_id'));
            if(!myUser) return false;
            if(myUser.placement < member!.placement) valid = true;
        }
        alarm.transactions.forEach(t => {
            if(t.assignedToId == localStorage.getItem(DBKeys.USER_ID)) valid = true;
        });
        return valid;
    }

}
