import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams } from '@ionic/angular';
import { from, map, Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { Control, ControlAlarm, AlarmState } from 'src/app/shared/models';

@Component({
  selector: 'app-alarm-list-tabs',
  templateUrl: './alarm-list-tabs.page.html',
  styleUrls: ['./alarm-list-tabs.page.scss'],
})
export class AlarmListTabsPage implements OnInit {
  private control: Control;

  protected alarms: Observable<ControlAlarm[]>;
  protected searchText: string = '';
  protected searchControl: FormControl = new FormControl();
  protected activeAlarmsPresent: boolean = true;
  protected liveValuesMap: Observable<Map<string, any>>;
  public pullMax = window.innerHeight * 0.7;
  public pullMin = window.innerHeight * 0.12;
  private sub!: Subscription;
  private nav: NavController;

  constructor(
    public navCtrl: NavController,
    private liveValuesService: LiveValueService,
    private alarmData: AlarmDataProvider,
    public roomData: RoomDataProvider,
    public controlData: ControlDataProvider,
    private navParams: NavParams
  ) {
    this.alarms = from([]);
    this.control = this.navParams.get('control');
    this.nav = this.navParams.get('nav');
    this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
  }

  ngOnInit() {
    this.alarms = this.alarmData.getAlarmsBinding().pipe(
      map((alarms: any) => {
        return alarms.filter(
          (a: any) =>
            a.state <= 1 && a.controlSerialNumber == this.control.serialNumber
        );
      })
    );
    this.sub = this.alarms.subscribe((alarms) => {
      this.activeAlarmsPresent =
        alarms.filter(
          (a) =>
            a.state <= 1 && a.controlSerialNumber == this.control.serialNumber
        ).length > 0;
    });
    this.alarmData.getAlarms().subscribe();
  }

  handleRefresh(event: any) {
    this.alarmData.getAlarms().subscribe((alarms) => {
      window.setTimeout(() => event.complete(), 500);
    });
  }

  public alarmStateColor(alarm: ControlAlarm) {
    if (alarm.state != AlarmState.Resolved && alarm.silent) return 'primary';
    switch (alarm.state) {
      case AlarmState.Active:
        return 'alarm0';
      case AlarmState.Acknowledged:
        return 'alarm1';
      case AlarmState.Resolved:
        return 'alarm2';
      default:
        return;
    }
  }

  public navigateToDetails(alarm: ControlAlarm) {
    this.nav.navigateForward('alarm-actions-page', {
      queryParams: { alarm: alarm },
    });
    // this.events.publish("AlarmNav", alarm)
  }

  ionViewWillUnload() {
    this.sub.unsubscribe();
    // this.events.unsubscribe('AlarmControlTabs')
  }

  goBack() {
    // this.events.publish("PopToRoot")
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
