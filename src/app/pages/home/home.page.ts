import { Component } from '@angular/core';
import { Observable, of, Subscription, map } from 'rxjs';
import { ControlAlarm, Control } from '../../shared/models/index';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { SignalRService } from 'src/app/core/services/signalr.service';
import { SiteContextService } from 'src/app/core/services/site-context.service';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  public alarms!: Observable<ControlAlarm[]>;
  public controls!: Observable<Control[]>;
  public rooms!: Observable<any[]>;
  public alarmCount!: Observable<number>;

  public controlCount!: number;
  public onlineControls!: number;
  public offlineControls!: number;

  public activeAlarms!: Observable<number>;
  public acknowledgedAlarms!: Observable<number>;

  public roomsMap = new Map<string, any>();

  private sub?: Subscription;

  constructor(
    private navCtrl: NavController,
    public alarmData: AlarmDataProvider,
    private controlData: ControlDataProvider,
    private roomData: RoomDataProvider,
    private siteContext: SiteContextService,
    private signalr: SignalRService,
  ) {}

   ionViewDidLoad() {
      this.alarms = this.alarmData.getAlarms();
      this.controls = this.controlData.getControls();
      if(this.controls) this.sub = this.controls.subscribe(controls => {
        this.controlCount = controls.length;
        this.onlineControls = controls.filter(control => control.status == 0 && this.siteContext.isSiteSelected(control.siteId)).length;
        this.offlineControls = controls.filter(control => control.status != 0 && this.siteContext.isSiteSelected(control.siteId)).length;
      })
      this.rooms = this.roomData.getRooms();
    }

  getOnlineControlsCount(): Observable<number> {
    if (!this.controls) return of(0);

    return this.controls.pipe(
      map(ctrls =>
        ctrls.filter(
          control =>
            control.status === 0 &&
            this.siteContext.isSiteSelected(control.siteId)
        ).length
      )
    );
  }

  getOfflineControlsCount(): Observable<number> {
    if (!this.controls) return of(0);

    return this.controls.pipe(
      map(ctrls =>
        ctrls.filter(
          control =>
            control.status !== 0 &&
            this.siteContext.isSiteSelected(control.siteId)
        ).length
      )
    );
  }

  signalrConnect(){
    this.signalr.connect();
  }

  signalrDisconnect(){
    this.signalr.disconnect();
  }


  ionViewDidEnter() {

    this.signalr.sendExtendedRoomData.subscribe(data => {
      var obj = {
        roomTemp: data.dayTemperatureHistory.history[0].toFixed(1),
        animalDay: data.animalDay,
        roomCFM: data.roomCFM
      }
      if (obj.roomTemp == "32.0") obj.roomTemp = null;
      this.roomsMap.set(data.serialNumber + '.' + data.roomIndex, obj)
    });




  }


  ionViewWillLeave() {
    if (this.sub) this.sub.unsubscribe();
  }

  navToAlarms() {
    this.navCtrl.navigateRoot('alarm-list')
  }

  navToControls() {
    this.navCtrl.navigateRoot('controls-list')
  }
}
