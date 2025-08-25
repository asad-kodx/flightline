import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { from, Observable, Subscription, map } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { AlarmState, ControlAlarm, Site } from 'src/app/shared/models';

@Component({
  selector: 'app-site-alarms-list',
  templateUrl: './site-alarms-list.page.html',
  styleUrls: ['./site-alarms-list.page.scss'],
  standalone: false
})
export class SiteAlarmsListPage implements OnInit {

    site?: Site;

    protected alarms: Observable<ControlAlarm[]>;
    protected searchText: string = ''
    protected searchControl: FormControl = new FormControl();
    protected activeAlarmsPresent: boolean = true;
    protected liveValuesMap: Observable<Map<string, any>>;
    public pullMax = window.innerHeight * .7
    public pullMin = window.innerHeight * .12
    private sub?: Subscription;

  constructor(
    private navCtrl: NavController, private liveValueService: LiveValueService, private alarmData: AlarmDataProvider, 
    public roomData: RoomDataProvider, public controlData: ControlDataProvider, private router: Router
  ) {
        this.alarms = from([]);
        this.liveValuesMap = this.liveValueService.getLiveValuesBinding();

        this.site = (this.router.currentNavigation()?.extras.state as any)?.site;
   }

  ngOnInit() {
  }


  ionViewWillEnter() {
    console.log("Site", this.site);
      this.alarms = this.alarmData.getAlarmsBinding()?.pipe(
        map((alarms: any) => {
          return alarms.filter((a:any) => a.state <=1 && a.siteId == this.site!.siteId);
      })
      );
    // this.alarms = this.alarmData.getAlarmsBinding().pipe();
      this.sub = this.alarms.subscribe(alarms => {
          this.activeAlarmsPresent = alarms.filter(a => a.state <=1 && a.siteId == this.site!.siteId).length > 0;
      });
      this.alarmData.getAlarms();
  }

  handleRefresh(event: RefresherCustomEvent) {
      this.alarmData.getAlarms()?.subscribe(alarms => {
          window.setTimeout(() => event.target.complete(), 500)
      })
  }

  ionViewWillUnload(){
      this.sub?.unsubscribe();
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
      console.log('Navigate to Details', alarm, this.navCtrl);
      this.navCtrl.navigateForward('alarm-details/alarm-actions', { state: { alarm }})
  }

  shouldShow(alarm: ControlAlarm): boolean {
      if (!this.searchText || this.searchText.trim() == "") return true;
      return (alarm.description.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
          alarm.controlName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
          alarm.controlSerialNumber.toString().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
          alarm.entityName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
          alarm.roomName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
          alarm.entityId.indexOf(this.searchText.toLocaleLowerCase()) > -1);
  }
}
