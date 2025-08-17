import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { SignalRService } from 'src/app/core/services/signalr.service';
import { ControlAlarm } from 'src/app/shared/models';

@Component({
  selector: 'app-alarm-group-members',
  templateUrl: './alarm-group-members.page.html',
  styleUrls: ['./alarm-group-members.page.scss'],
  standalone: false
})
export class AlarmGroupMembersPage implements OnInit, OnDestroy {
  public alarm: ControlAlarm;
  private sub!: Subscription;
    public nav: any;
    constructor(private navParams: NavParams, private alarmDataProvider: AlarmDataProvider, private signalr: SignalRService, private navCtrl: NavController) {
        this.alarm = this.navParams.data['alarm'];
        this.nav = this.navParams.data['nav'];
    }

    ngOnInit() {
        this.sub = this.signalr.alarmDataReceivedEvent$.subscribe((alarm: ControlAlarm) => {
            if (alarm.controlAlarmId == this.alarm.controlAlarmId) {
                this.alarm = alarm;
            }
        });

        if (this.alarm) {
            var temp = this.alarmDataProvider.getAlarm(this.alarm.fusionAlarmKey);
            console.log("Temp", temp);
            if (temp) this.alarm = temp;
        }

        // this.events.subscribe('AlarmSwitch', alarm => {
        //     console.log("Alarm switch", alarm)
        //     if (this.alarm.fusionAlarmKey != alarm.fusionAlarmKey) {
        //         this.alarm = alarm;
        //         try {
        //             this.navCtrl.parent.select(0);
        //         }
        //         catch{
        //             console.log("Attempt to switch tabs failed", this.navCtrl)
        //         }
        //     }
        // })
    }

    ngOnDestroy() {
        console.log("Unloaded from Members")
        this.sub.unsubscribe();
        // this.events.unsubscribe('AlarmSwitch')
    }

    popBack() {
        if (this.nav) this.nav.pop();
        // else this.events.publish("PopToRoot");
    }


}
