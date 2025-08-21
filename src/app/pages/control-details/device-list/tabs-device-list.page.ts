import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, ActionSheetController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { Room, RemoteSettingCommandType, EntityType, Device, DeviceType } from 'src/app/shared/models';

@Component({
  selector: 'app-tabs-device-list',
  templateUrl: './tabs-device-list.page.html',
  styleUrls: ['./tabs-device-list.page.scss'],
  standalone: false
})
export class TabsDeviceListPage implements OnInit {

 private control: any;
    protected rooms: any;
    protected searchText: string = '';
    protected searchControl: FormControl = new FormControl();
    protected liveValuesMap!: Observable<Map<string, any>>;
    public pullMax = window.innerHeight * .7
    public pullMin = window.innerHeight * .12
    private nav: NavController;

    constructor(private navParams: NavParams, private roomData: RoomDataProvider, private lvService: LiveValueService, public navCtrl: NavController, private actionSheet: ActionSheetController, public alarmData: AlarmDataProvider, private toastCtrl: ToastController) {
            this.control = this.navParams.get('control');;
            this.nav = this.navParams.get('nav');
    }
    ngOnInit() {
        this.rooms = JSON.parse(localStorage.getItem(`devices_${103}` ) || '');
        this.roomData.getDevicesForControl(this.control.serialNumber).subscribe((rooms) => {
            this.rooms = rooms;
        });
        this.liveValuesMap = this.lvService.getLiveValuesBinding();
        // this.liveValuesMap.subscribe(liveValues => {
        //     this.rooms.subscribe((rm: any) => {
        //         rm.forEach(room => {
        //             room.devices.forEach(device => {
        //                 if (liveValues.has(device.deviceSerialNumber)) {
        //                     device.liveValueData = liveValues.get(device.deviceSerialNumber);
        //                 }
        //             });
        //         });
        //     });
        // });
    }

    ionViewWillUnload(){
        // this.events.unsubscribe('AlarmControlTabs');
    }

    protected getDeviceModeText(mode: string): string {
        switch (mode) {
            case "0": return 'auto';
            case "1": return 'manual';
            case "2": return 'stop';
            default: return '';
        }
    }

    getLVColor(value: any){
        if(value) return 'white';
        return 'orange'
    }

    async navToRoomSettings(controlSerialNumber: number,room: Room) {
        const actionSheet = await this.actionSheet.create({
          header: "Room Navigation",
          buttons: [
            {
              text: "Room Settings",
              handler: () => {
                if (this.control.fusionStatus < 13) {
                  this.toastCtrl.create({
                    message: "Can't request settings as control is marked offline",
                    position: 'middle',
                    duration: 5000,
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  });
                  actionSheet.present();
                  return;
                }
                var roomData: any = { entityNumber: controlSerialNumber + "." + room.programId, controlSerialNumber: controlSerialNumber, controlName: this.control.name, deviceName: '', remoteSettingType: RemoteSettingCommandType.EntitySettings, entityType: EntityType.Room };
                console.log('Navigating to room settings', roomData);
                this.nav.navigateForward('remote-settings-page', roomData);
              }
            },
            {
              text: "Alarm Settings",
              handler: async () => {
                if (this.control.fusionStatus < 13) {
                  const toastController = await this.toastCtrl.create({
                    message: "Can't request settings as control is marked offline",
                    position: 'middle',
                    duration: 5000,
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  });
                  toastController.present();
                  return;
                }
                //Navigate to room alarm settings
                var roomData: any = { entityNumber: controlSerialNumber + "." + room.programId, roomId: controlSerialNumber + "." + room.programId, controlSerialNumber: controlSerialNumber, controlName: this.control.name, deviceName: '', remoteSettingType: RemoteSettingCommandType.AlarmSettings, entityType: EntityType.Room };
                console.log('Navigating to room alarm settings', roomData);
                this.nav.navigateForward('remote-settings-page', roomData);
              }
            }
          ]
        })
        await actionSheet.present();       
    }
    async navToRemoteControl(device: Device) {
        const actionSheet = await this.actionSheet.create({
          header: "Device Navigation",
          buttons: [
            {
              text: 'Alarms',
              handler: () => {
                this.nav.navigateForward('entity-alarms-page', { queryParams: { device } });
              }
            },
            {
              text: 'Remote Control',
              handler: () => {
                console.log("Nav to remote control", device);
                this.nav.navigateForward('remote-control-page', { queryParams: { device } });
              }
            },
            {
              text: 'Device Settings',
              handler: () => {
                if (this.control.fusionStatus < 13) {
                  this.toastCtrl.create({
                    message: "Can't request settings as control is marked offline",
                    position: 'middle',
                    duration: 5000,
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  });
                  actionSheet.present();
                  return;
                }
                var deviceData: any = { entityNumber: device.deviceSerialNumber, roomId: device.controlSerialNumber + "." + device.roomProgramId, controlSerialNumber: device.controlSerialNumber, controlName: this.control.name, deviceName: device.deviceName, remoteSettingType: RemoteSettingCommandType.EntitySettings, entityType: EntityType.Device };
                console.log("Nav to device settings", deviceData);
                this.nav.navigateForward('remote-settings-page', deviceData);
              }
            },
            {
              text: 'Alarm Settings',
              handler: () => {
                if (this.control.fusionStatus < 13) {
                  this.toastCtrl.create({
                    message: "Can't request settings as control is marked offline",
                    position: 'middle',
                    duration: 5000,
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  });
                  actionSheet.present();
                  return;
                }
                var deviceData: any = { entityNumber: device.deviceSerialNumber, roomId: device.controlSerialNumber + "." + device.roomProgramId, controlSerialNumber: device.controlSerialNumber, controlName: this.control.name, deviceName: device.deviceName, remoteSettingType: RemoteSettingCommandType.AlarmSettings, entityType: EntityType.Device };
                console.log("Nav to Device alarm settings", deviceData);
                this.nav.navigateForward('remote-settings-page', deviceData);
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
            }
          ]
        })
        actionSheet.present()
    }
    handleRefresh(event: any) {
        this.roomData.getDevicesForControl(this.control.serialNumber).subscribe({
          next: (rooms: any) => {
            this.rooms = rooms;
            window.setTimeout(() => event.complete(), 500)
        }, error: (err) => {
            window.setTimeout(() => event.complete(), 500)
        }});
    }

    expandRoom(room: any){
        if(room.collapsed) room.collapsed = false;
        else room.collapsed = true;
    }
    
    goBack() {
        // this.events.publish("PopToRoot")
    }
    shouldShow(device: Device): boolean {
        if (device.deviceType == DeviceType.RemoteDevice) return false;
        if (!this.searchText || this.searchText.trim() == "") return true;
        return (device.deviceName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            device.deviceSerialNumber.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1);
    }
    shouldShowBadge(device: Device) {
        var ac = this.alarmData.getAlarmCounts(null, device.deviceSerialNumber, null);
        if (ac.acknowledgedCount + ac.activeCount == 0) return false;
        return true;
    }
    shouldShowSilentBadge(device: Device) {
        var ac = this.alarmData.getAlarmCounts(null, device.deviceSerialNumber, null);
        if (ac.silentCount == 0) return false;
        return true;
    }

}
