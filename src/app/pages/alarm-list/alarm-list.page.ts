import { Component } from '@angular/core';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlarmState, ControlAlarm } from 'src/app/shared/models';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import * as _ from 'lodash';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';

@Component({
  selector: 'app-alarm-list',
  templateUrl: './alarm-list.page.html',
  styleUrls: ['./alarm-list.page.scss'],
  standalone: false,
})
export class AlarmListPage {
  public myAlarmsPresent: boolean = true;
  public activeAlarmsPresent: boolean = true;
  public resolvedAlarmsPresent: boolean = true;
  private sub!: Subscription;

  public alarms!: Observable<ControlAlarm[]>;
  public segmentSelected: any = 'mine';
  public searchText!: string;
  public searchControl: FormControl = new FormControl();
  public pullMax = window.innerHeight * 0.7;
  public pullMin = window.innerHeight * 0.12;

  constructor(
    private navCtrl: NavController,
    private alarmData: AlarmDataProvider,
    public roomData: RoomDataProvider,
    private liveValues: LiveValuesSubscription
  ) {}

  ionViewDidEnter() {
    this.alarms = this.alarmData.getAlarmsBinding();
    this.sub = this.alarms?.subscribe((alarms) => {
      this.myAlarmsPresent = alarms.filter((a) => a.state <= 1).length > 0;
      this.activeAlarmsPresent = alarms.filter((a) => a.state <= 1).length > 0;
      this.resolvedAlarmsPresent =
        alarms.filter((a) => a.state === 2).length > 0;
      this.myAlarmsPresent = alarms.length > 0;
      let entityIds: string[] = [];
      alarms.forEach((a) => {
        entityIds.push(a.entityHardwareId || ''
        );
      });
      entityIds = _.union(entityIds);
      this.liveValues.requestLiveValuesList(entityIds).subscribe();
    });
  }

  ionViewWillEnter() {
    this.getAlarmData();
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.getAlarmData()?.subscribe({
      next: (unused) => {
        window.setTimeout(() => event.target.complete(), 500);
      },
      error: (err) => {
        console.error(err);
      },
    });
    // {
    //   next:(unused) => {
    //   window.setTimeout(() => event.complete(), 500)
    // }, error => { }
  }

  ionViewDidLeave() {
    this.sub?.unsubscribe();
  }

  getAlarmData() {
    this.alarmData.getAlarms<ControlAlarm[]>().subscribe();

    return this.alarms;
  }
}
