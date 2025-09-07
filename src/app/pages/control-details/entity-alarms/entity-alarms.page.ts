import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { from, map, Observable } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import {
  Sensor,
  Device,
  ControlAlarm,
  AlarmState,
} from 'src/app/shared/models';

@Component({
  selector: 'app-entity-alarms',
  templateUrl: './entity-alarms.page.html',
  styleUrls: ['./entity-alarms.page.scss'],
  standalone: false
})
export class EntityAlarmsPage implements OnInit {
  public entity: Sensor & Device;

  protected alarms: Observable<ControlAlarm[]>;
  protected searchText: string = '';
  protected searchControl: FormControl = new FormControl();
  protected activeAlarmsPresent: boolean = true;
  protected liveValuesMap?: Observable<Map<string, any> | undefined>
  public pullMax = window.innerHeight * 0.7;
  public pullMin = window.innerHeight * 0.12;

  constructor(
    public navCtrl: NavController,
    private liveValuesService: LiveValueService,
    private alarmData: AlarmDataProvider,
    public roomData: RoomDataProvider,
    public controlData: ControlDataProvider,
    private router: Router
  ) {
    this.alarms = from([]);
    this.entity = (this.router.currentNavigation()?.extras.state as any).sensor;
    if (this.entity.entitySerialNumber) {
      this.entity = this.roomData.getEntity(this.entity.entitySerialNumber)!;
    }
    this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
  }

  ngOnInit() {
    this.alarms = this.alarmData
      .getAlarms<ControlAlarm[]>()
      .pipe(
        map((alarms: any) =>
          alarms.filter(
            (a: any) =>
              a.state !== AlarmState.Resolved &&
              a.hardwareId ===
                (this.entity?.sensorSerialNumber ||
                  this.entity?.deviceSerialNumber)
          )
        )
      );

    this.alarms.subscribe((alarms) => {
      this.activeAlarmsPresent =
        alarms.filter(
          (a) =>
            a.state != AlarmState.Resolved &&
            a.hardwareId ==
              (this.entity.sensorSerialNumber || this.entity.deviceSerialNumber)
        ).length > 0;
    });
  }

  ionViewWillEnter() {
    // this.events.subscribe('AlarmControlTabs', (alarm: any) => {
    //     this.navCtrl.navigateForward('alarm-actions-page', {queryParams: { alarm: alarm, nav: this.navCtrl }});
    // })
  }

  ionViewWillLeave() {
    // this.events.unsubscribe('AlarmControlTabs')
  }

  handleRefresh(event: any) {
    this.alarms = this.alarmData.getAlarms<ControlAlarm[]>().pipe(
      map((alarms) => {
        console.log(alarms, this.entity);
        return alarms.filter(
          (a: any) =>
            a.state != AlarmState.Resolved &&
            a.hardwareId ==
              (this.entity.sensorSerialNumber || this.entity.deviceSerialNumber)
        );
      })
    );
    window.setTimeout(() => event.complete(), 500);
  }

  public alarmStateColor(alarm: ControlAlarm) {
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
    this.navCtrl.navigateForward('alarm-actions-page', {
      queryParams: {alarm: alarm,
      nav: this.navCtrl,}
    });
  }

  goBack() {
    // this.events.publish('PopToRoot');
  }

  shouldShow(alarm: ControlAlarm): boolean {
    if (!this.searchText || this.searchText.trim() == '') return true;
    return (
      alarm.description
        .toLocaleLowerCase()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      alarm.controlName
        .toLocaleLowerCase()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      alarm.controlSerialNumber
        .toString()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      alarm.entityName
        .toLocaleLowerCase()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      alarm.roomName
        .toLocaleLowerCase()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      alarm.entityId.indexOf(this.searchText.toLocaleLowerCase()) > -1
    );
  }
}
