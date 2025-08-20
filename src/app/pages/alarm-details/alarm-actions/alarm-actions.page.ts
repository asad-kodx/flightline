import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { SignalRService } from 'src/app/core/services/signalr.service';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import {
  ControlAlarm,
  AlarmState,
  EntityType,
  RemoteSettingCommandType,
  DBKeys,
} from 'src/app/shared/models';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-alarm-actions',
  templateUrl: './alarm-actions.page.html',
  styleUrls: ['./alarm-actions.page.scss'],
  standalone: false

})
export class AlarmActionsPage implements OnInit {
  public alarm!: ControlAlarm;
  private sub!: Subscription;
  protected liveValuesMap: Observable<Map<string, any>>;
  public pullMax = window.innerHeight * 0.7;
  public pullMin = window.innerHeight * 0.12;
  public nav: any;
  public actionsExpanded: boolean = true;
  public membersExpanded!: boolean;
  public assignmentsExpanded!: boolean;

  private ackPressed!: boolean;
  private bumpPressed!: boolean;
  private resolvePressed!: boolean;

  constructor(
    private alarmDataProvider: AlarmDataProvider,
    private signalr: SignalRService,
    private liveValues: LiveValuesSubscription,
    public roomData: RoomDataProvider,
    private liveValuesService: LiveValueService,
    public controlData: ControlDataProvider,
    // private events: Events,
    private route: ActivatedRoute,
    public navCtrl: NavController
  ) {
    // this.alarm = this.navParams.data['alarm'];

    // if (!this.alarm.state) this.alarm = this.navParams.data['alarm'];
    // this.nav = this.navParams.data['nav'];
    this.route.queryParams.subscribe((params) => {
      this.alarm = params['alarm'];
    });

    this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
  }

  ngOnInit() {
    window.setTimeout(() => {
      this.liveValues
        .requestLiveValuesList([this.alarm.entityHardwareId])
        .subscribe(),
        1000;
    });
    // console.log('Loaded alarm actions', this.alarm, this.navParams);
    if (!this.alarm) return;
    // if (!this.alarm.description) this.alarm = this.navParams.data['alarm'];
    if (!this.alarm.transactions || this.alarm.transactions.length == 0) {
      this.alarmDataProvider
        .getSingleAlarm(this.alarm.fusionAlarmKey)
        .subscribe((alarm: ControlAlarm) => {
          if (alarm) this.alarm = alarm;
        });
    }

    this.sub = this.signalr.alarmDataReceivedEvent$.subscribe(
      (alarm: ControlAlarm) => {
        if (this.alarm) {
          if (alarm.controlAlarmId == this.alarm.controlAlarmId) {
            this.alarm = alarm;
            this.ackPressed = false;
            this.resolvePressed = false;
            this.bumpPressed = false;
          }
        }
      }
    );
    if (this.alarm) {
      var temp = this.alarmDataProvider.getAlarm(this.alarm.fusionAlarmKey);
      if (temp) this.alarm = temp;
    }

    // this.events.subscribe('AlarmSwitch', (alarm: any) => {
    //   if (this.alarm.fusionAlarmKey != alarm.fusionAlarmKey) {
    //     this.alarm = alarm;
    //     this.alarmDataProvider
    //       .getSingleAlarm(this.alarm.fusionAlarmKey)
    //       .subscribe((alarm: ControlAlarm) => {
    //         if (alarm) this.alarm = alarm;
    //         this.liveValues
    //           .requestLiveValuesList([this.alarm.entityHardwareId])
    //           .subscribe();
    //         this.ackPressed = false;
    //         this.resolvePressed = false;
    //         this.bumpPressed = false;
    //       });
    //   }
    // });
  }

  ionViewWillUnload() {
    console.log('Unloaded from Actions');
    if (this.sub) this.sub.unsubscribe();
  }

  public handleRefresh(event: any) {
    this.alarmDataProvider.getSingleAlarm(this.alarm.fusionAlarmKey).subscribe(
      (alarm: ControlAlarm) => {
        if (alarm) this.alarm = alarm;
        window.setTimeout(() => event.complete(), 500);
      },
      (err) => {
        window.setTimeout(() => event.complete(), 500);
      }
    );
  }

  public alarmColor() {
    if (!this.alarm) return null;
    if (this.alarm.state != AlarmState.Resolved && this.alarm.silent)
      return 'primary';
    switch (this.alarm.state) {
      case AlarmState.Active:
        return 'alarm0';
      case AlarmState.Acknowledged:
        return 'alarm1';
      case AlarmState.Resolved:
        return 'alarm2';
      default:
        return null;
    }
  }

  popBack() {
    if (this.nav) this.nav.pop();
    // else this.events.publish('PopToRoot');
  }

  goToSettings() {
    var entity = this.roomData.getEntity(this.alarm.hardwareId);
    if (entity) {
      var type = null;
      if (entity.sensorSerialNumber) type = EntityType.Sensor;
      else if (entity.deviceSerialNumber) type = EntityType.Device;

      var sensorData: any = {
        entityNumber: this.alarm.hardwareId,
        roomId: this.alarm.roomProgramId,
        controlSerialNumber: entity.controlSerialNumber,
        controlName: this.alarm.controlName,
        deviceName: entity.sensorName || entity.deviceName,
        remoteSettingType: RemoteSettingCommandType.AlarmSettings,
        entityType: type,
      };
      this.navCtrl.navigateForward('remote-settings', sensorData);
    } else {
      var roomData: any = {
        entityNumber: this.alarm.hardwareId,
        roomId: this.alarm.hardwareId,
        controlSerialNumber: this.alarm.controlSerialNumber,
        controlName: this.alarm.controlName,
        deviceName: '',
        remoteSettingType: RemoteSettingCommandType.AlarmSettings,
        entityType: EntityType.Room,
      };
      this.navCtrl.navigateForward('remote-settings-page', roomData);
    }
  }

  getNextBumpTime() {
    if (
      !this.alarm.alarmGroupId ||
      this.alarm.state != AlarmState.Active ||
      this.alarm.transactions.length == 0
    )
      return null;
    if (this.alarm.bumpTime < 2) this.alarm.bumpTime = 2;
    return moment(this.alarm.transactions[0].created)
      .add(this.alarm.bumpTime, 'minutes')
      .toDate();
  }

  getAckExpireTime() {
    if (
      this.alarm.state != AlarmState.Acknowledged ||
      this.alarm.transactions.length == 0
    )
      return null;
    if (this.alarm.ackTime < 2) this.alarm.ackTime = 2;
    return moment(this.alarm.transactions[0].created)
      .add(this.alarm.ackTime, 'minutes')
      .toDate();
  }

  isAtBumpLimit() {
    return moment().diff(moment(this.alarm.created), 'minutes') > 2880;
  }

  public acknowledgeAlarm() {
    this.ackPressed = true;
    this.bumpPressed = true;
    this.alarmDataProvider.acknowledgeAlarm(this.alarm).subscribe();
  }

  public resolveAlarm() {
    this.resolvePressed = true;
    this.ackPressed = true;
    this.bumpPressed = true;
    this.alarmDataProvider.resolveAlarm(this.alarm).subscribe();
  }

  public bumpAlarm() {
    this.bumpPressed = true;
    this.alarmDataProvider.bumpAlarm(this.alarm).subscribe();
  }

  public canAcknowledge() {
    if (this.ackPressed || this.resolvePressed) return false;
    if (!this.alarm) return false;
    if (this.alarm.transactions.length == 0) return false;
    if (this.alarm.state == AlarmState.Active) {
      if (!this.alarm.alarmGroup) return true;
      if (
        this.alarm.alarmGroup.members.find(
          (agm) => agm.userId == localStorage.getItem('user_id')
        )
      )
        return true;
    }
    if (this.alarm.state == AlarmState.Acknowledged) {
      if (
        this.alarm.transactions[0].assignedToId ==
        localStorage.getItem('user_id')
      )
        return true;
    }
    return false;
  }

  public canResolve() {
    if (this.resolvePressed) return false;
    if (!this.alarm) return false;
    if (this.alarm.transactions.length == 0) return false;
    if (this.alarm.state != AlarmState.Resolved) {
      if (!this.alarm.alarmGroup) return true;
      if (
        this.alarm.alarmGroup.members.find(
          (agm) => agm.userId == localStorage.getItem('user_id')
        )
      )
        return true;
    }
    return false;
  }

  public canBump() {
    if (this.bumpPressed || this.resolvePressed) return false;
    if (!this.alarm) return false;
    if (this.alarm.transactions.length == 0) return false;
    if (!this.alarm.alarmGroup) return false;
    if (this.alarm.state == AlarmState.Active) {
      if (this.alarm.assignedToId == localStorage.getItem(DBKeys.USER_ID))
        return true;
    }

    return false;
  }

  toggleCard(card: string) {
    console.log('Toggle card');
    switch (card) {
      case 'actions':
        if (this.actionsExpanded) this.actionsExpanded = false;
        else this.actionsExpanded = true;
        console.log('Toggle card returning');
        return;
      case 'members':
        if (this.membersExpanded) this.membersExpanded = false;
        else this.membersExpanded = true;
        return;
      case 'assignments':
        if (this.assignmentsExpanded) this.assignmentsExpanded = false;
        else this.assignmentsExpanded = true;
        return;
    }
  }

  goToRemoteControl() {
    var device = this.roomData.getEntity(this.alarm.hardwareId);
    this.navCtrl.navigateForward('remote-control-component', {queryParams: device});
  }
}
