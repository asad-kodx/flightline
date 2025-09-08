import { Component, Input, OnInit } from '@angular/core';
import {
  AlarmCount,
  Control,
  DeviceType,
  EntityType,
  LiveValueDisplay,
  Mode,
  ModeDisplayType,
  RemoteSettingCommandType,
  SensorType,
} from '../../models';
import {
  ActionSheetController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { SiteContextService } from 'src/app/core/services/site-context.service';
@Component({
  selector: 'entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
  standalone: false,
})
export class EntityComponent {
  @Input('sensor') sensor!: any;
  @Input('device') device!: any;
  @Input('searchText') searchText!: string;
  @Input('alarmCount') alarmCount!: Observable<Map<string, AlarmCount>>;
  @Input('liveValueDisplay') liveValueDisplay!: LiveValueDisplay;
  @Input('modeType') modeType!: ModeDisplayType;

  text!: string;
  protected liveValuesMap: Observable<Map<string, any>>;
  private control!: Control;
  private sub: Subscription;

  constructor(
    private liveValuesService: LiveValueService,
    public controlData: ControlDataProvider,
    private siteContext: SiteContextService,
    private actionSheet: ActionSheetController,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
    this.sub = this.liveValuesMap.subscribe((map) => {
      var data;
      if (this.sensor) {
        data = map.get(this.sensor.entitySerialNumber);
        if (data) this.sensor.liveValueData = data.value;
      }
      if (this.device) {
        data = map.get(this.device.entitySerialNumber);
        if (data) {
          this.device.liveValueData = data.value;
          this.device.mode = data.mode;
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  itemTapped(event: any, item: any) {
    console.log(item);
    // this.quickNav.configureMenu(item.entityType, item);
    // this.quickNav.showMenu();
  }

  shouldShow() {
    if (this.sensor) {
      if (!this.siteContext.isSiteSelected(this.sensor.siteId)) return false;
      if (this.sensor.deviceOrSensorType == SensorType.RemoteSensor) return false;
    }
    if (this.device) {
      if (!this.siteContext.isSiteSelected(this.device.siteId)) return false;
      if (this.device.deviceOrSensorType == DeviceType.RemoteDevice) return false;
    }
    if (!this.searchText || this.searchText.trim() == '') return true;

    if (this.sensor) {
      return (
        this.sensor.entityName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.sensor.entitySerialNumber
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.sensor.controlName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.sensor.roomName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.sensor.controlSerialNumber.indexOf(
          this.searchText.toLocaleLowerCase()
        ) > -1
      );
    }

    if (this.device) {
      return (
        this.device.entityName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.device.entitySerialNumber
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.device.controlName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.device.roomName
          .toLocaleLowerCase()
          .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
        this.device.controlSerialNumber.indexOf(
          this.searchText.toLocaleLowerCase()
        ) > -1
      );
    }
    return false;
  }

  async sensorTapped(sensor: any) {
    this.controlData
      .getControlBySerialNo(this.sensor.serialNo || this.device.serialNo)
      .subscribe((ctrl) => {
        this.control = ctrl;
      });
    const actionSheet = await this.actionSheet.create({
      header: 'Sensor Navigation',
      buttons: [
        {
          text: 'Alarms',
          handler: () => {
            this.navCtrl.navigateForward(['entity-alarms-page', sensor]);
          },
        },
        {
          text: 'Graph',
          handler: async () => {
            if (this.control.fusionStatus < 13) {
              const toast = await this.toastCtrl.create({
                message: "Can't open connection as control is marked offline",
                position: 'middle',
                duration: 5000,
                buttons: [{ text: 'Close', role: 'cancel' }],
              });
              await toast.present();
              return;
            }
            this.navCtrl.navigateForward(['entity-graphs-page', sensor]);
          },
        },
        {
          text: 'Alarm Settings',
          handler: async () => {
            if (this.control.fusionStatus < 13) {
              const toast = await this.toastCtrl.create({
                message: "Can't request settings as control is marked offline",
                position: 'middle',
                duration: 5000,
                buttons: [{ text: 'Close', role: 'cancel' }],
              });
              await toast.present();
              return;
            }
            const sensorData: any = {
              entityNumber: sensor.entitySerialNumber,
              roomId: sensor.controlSerialNumber + '.' + sensor.programId,
              controlSerialNumber: sensor.controlSerialNumber,
              controlName: sensor.controlName,
              deviceName: sensor.entityName,
              remoteSettingType: RemoteSettingCommandType.AlarmSettings,
              entityType: EntityType.Sensor,
            };
            console.log('Navigating to Sensor alarm settings', sensorData);
            this.navCtrl.navigateForward('remote-settings-page', {
              state: { sensorData },
            });
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  // async openDeviceActionSheet(device: any) {
  //   const actionSheet = await this.actionSheet.create({
  //     header: 'Device Navigation',
  //     buttons: [
  //       {
  //         text: 'Alarms',
  //         handler: () => {
  //           this.navCtrl.navigateForward('entity-alarms-page', {
  //             state: { device },
  //           });
  //         },
  //       },
  //       {
  //         text: 'Remote Control',
  //         handler: () => {
  //           console.log('Nav to remote control', device);
  //           this.navCtrl.navigateForward('remote-control-page', {
  //             state: { device },
  //           });
  //         },
  //       },
  //       {
  //         text: 'Device Settings',
  //         handler: async () => {
  //           if (this.control.fusionStatus < 13) {
  //             const toast = await this.toastCtrl.create({
  //               message: "Can't request settings as control is marked offline",
  //               position: 'middle',
  //               duration: 5000,
  //               buttons: [{ text: 'Close', role: 'cancel' }],
  //             });
  //             toast.present();
  //             return;
  //           }

  //           const deviceData: any = {
  //             entityNumber: device.entitySerialNumber,
  //             roomId: device.controlSerialNumber + '.' + device.programId,
  //             controlSerialNumber: device.controlSerialNumber,
  //             controlName: device.controlName,
  //             deviceName: device.entityName,
  //             remoteSettingType: RemoteSettingCommandType.EntitySettings,
  //             entityType: EntityType.Device,
  //           };
  //           console.log('Nav to device settings', deviceData);

  //           this.navCtrl.navigateForward('remote-settings-page', {
  //             state: { deviceData },
  //           });
  //         },
  //       },
  //       {
  //         text: 'Alarm Settings',
  //         handler: async () => {
  //           if (this.control.fusionStatus < 13) {
  //             const toast = await this.toastCtrl.create({
  //               message: "Can't request settings as control is marked offline",
  //               position: 'middle',
  //               duration: 5000,
  //               buttons: [{ text: 'Close', role: 'cancel' }],
  //             });
  //             toast.present();
  //             return;
  //           }

  //           const deviceData: any = {
  //             entityNumber: device.entitySerialNumber,
  //             roomId: device.controlSerialNumber + '.' + device.programId,
  //             controlSerialNumber: device.controlSerialNumber,
  //             controlName: device.controlName,
  //             deviceName: device.entityName,
  //             remoteSettingType: RemoteSettingCommandType.AlarmSettings,
  //             entityType: EntityType.Device,
  //           };
  //           console.log('Nav to Device alarm settings', deviceData);

  //           this.navCtrl.navigateForward('remote-settings-page', {
  //             state: { deviceData },
  //           });
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //     ],
  //   });

  //   await actionSheet.present();
  // }

  async deviceTapped(device: any) {
    const actionSheet = await this.actionSheet.create({
      header: 'Device Navigation',
      buttons: [
        {
          text: 'Alarms',
          handler: async () => {
            await this.navCtrl.navigateForward('entity-alarms', {
              state: { device },
            });
          },
        },
        {
          text: 'Remote Control',
          handler: () => {
            console.log('Nav to remote control', device);
            this.navCtrl.navigateForward('remote-control-component', {
              state: { device },
            });
          },
        },
        {
          text: 'Device Settings',
          handler: async () => {
            if (this.control.fusionStatus < 13) {
              const toast = await this.toastCtrl.create({
                message: "Can't request settings as control is marked offline",
                position: 'middle',
                duration: 5000,
                buttons: [{ text: 'Close', role: 'cancel' }],
              });
              toast.present();
              return;
            }
            const deviceData: any = {
              entityNumber: device.entitySerialNumber,
              roomId: device.controlSerialNumber + '.' + device.programId,
              controlSerialNumber: device.controlSerialNumber,
              controlName: device.controlName,
              deviceName: device.entityName,
              remoteSettingType: RemoteSettingCommandType.EntitySettings,
              entityType: EntityType.Device,
            };
            console.log('Nav to device settings', deviceData);
            this.navCtrl.navigateForward('remote-settings', {
              state: { deviceData },
            });
          },
        },
        {
          text: 'Alarm Settings',
          handler: async () => {
            if (this.control.fusionStatus < 13) {
              const toast = await this.toastCtrl.create({
                message: "Can't request settings as control is marked offline",
                position: 'middle',
                duration: 5000,
                buttons: [{ text: 'Close', role: 'cancel' }],
              });
              toast.present();
              return;
            }
            const deviceData: any = {
              entityNumber: device.entitySerialNumber,
              roomId: device.controlSerialNumber + '.' + device.programId,
              controlSerialNumber: device.controlSerialNumber,
              controlName: device.controlName,
              deviceName: device.entityName,
              remoteSettingType: RemoteSettingCommandType.AlarmSettings,
              entityType: EntityType.Device,
            };
            console.log('Nav to Device alarm settings', deviceData);
            this.navCtrl.navigateForward('remote-settings', {
              state: { deviceData },
            });
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  shouldShowMode() {
    if (this.modeType == null) return true;
    if (this.modeType == ModeDisplayType.All) return true;
    if (
      this.modeType == ModeDisplayType.ManualOn &&
      this.device.mode == Mode.Manual &&
      this.device.liveValueData != 0
    )
      return true;
    if (
      this.modeType == ModeDisplayType.ManualOff &&
      ((this.device.mode == Mode.Manual && this.device.liveValueData == 0) ||
        this.device.mode == Mode.Stop)
    )
      return true;
    if (this.modeType == ModeDisplayType.Auto && this.device.mode == Mode.Auto)
      return true;
    else return false;
  }

  getLVColor(value: any) {
    if (value) return 'white';
    return 'orange';
  }
}
