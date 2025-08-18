import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, ModalController, ToastController, ActionSheetController } from '@ionic/angular';
import { catchError, Observable, of } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { Room, RemoteSettingCommandType, EntityType, Sensor, SensorType } from 'src/app/shared/models';

@Component({
  selector: 'app-tab-sensor-list',
  templateUrl: './tab-sensor-list.page.html',
  styleUrls: ['./tab-sensor-list.page.scss'],
})
export class TabSensorListPage implements OnInit {


 public control: any;
    protected rooms: any;
    protected searchText: string = ''
    protected searchControl: FormControl = new FormControl();
    protected liveValuesMap!: Observable<Map<string, any>>;
    public pullMax = window.innerHeight * .7;
    public pullMin = window.innerHeight * .12;
    private nav: NavController;

    constructor(private navParams: NavParams, public navCtrl: NavController, private roomData: RoomDataProvider, private liveValuesService: LiveValueService, private liveValueSub: LiveValuesSubscription,
    private lvSub: LiveValuesSubscription, private modalCtrl: ModalController, private toastCtrl: ToastController, private actionSheet: ActionSheetController, public alarmData: AlarmDataProvider) {
        this.control = this.navParams.get('control');;
        this.nav = this.navParams.get('nav');
        console.log(this.control, this.nav)
    }
    ngOnInit() {
        if (!this.control.serialNumber) return;
        this.rooms = JSON.parse(localStorage.getItem(`sensors_${this.control.serialNumber}`) || '');
        this.roomData.getSensorsForControl(this.control.serialNumber).pipe(
          catchError(() => {
            return of(null);
        })
        )
        
        .subscribe((rooms: any) => {
            this.rooms = rooms;
            rooms.forEach((rm: Room) => {
                this.liveValueSub.requestExtendedLiveValues(this.control.serialNumber, rm.programId).subscribe();
            })
        });
        this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();

    }

    ionViewWillUnload(){
        // this.events.unsubscribe('AlarmControlTabs');
    }

    handleRefresh(event: any) {
        this.roomData.getSensorsForControl(this.control.serialNumber).subscribe(rooms => {
            console.log('refresh sub')
            this.rooms = rooms;
            window.setTimeout(() => event.complete(), 500)
        }, err => {
            console.log('refresh err')
            window.setTimeout(() => event.complete(), 500)
        });
    }

    goBack() {
        // this.events.publish("PopToRoot");
    }

    expandRoom(room: any){
        if(room.collapsed) room.collapsed = false;
        else room.collapsed = true;
    }

    getLVColor(value: any){
        if(value) return 'white';
        return 'orange'
    }

    async navToRoomSettings(controlSerialNumber: number,room: Room) {
        console.log(room)
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
                var roomData: any = { entityNumber: controlSerialNumber + "." + room.programId, controlSerialNumber: controlSerialNumber, controlName: this.control.name, deviceName: "", remoteSettingType: RemoteSettingCommandType.EntitySettings, entityType: EntityType.Room };
                console.log('Navigating to room settings', roomData);
                this.nav.navigateForward('remote-settings-page', roomData);
              }
            },
            {
              text: "Alarm Settings",
              handler: async () => {
                if (this.control.fusionStatus < 13) {
                  this.toastCtrl.create({
                    message: "Can't request settings as control is marked offline",
                    position: 'middle',
                    duration: 5000,
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  });
                  await actionSheet.present();
                  return;
                }
                //Navigate to room alarm settings
                var roomData: any = { entityNumber: controlSerialNumber + "." + room.programId, roomId: controlSerialNumber + "." + room.programId, controlSerialNumber: controlSerialNumber, controlName: this.control.name, deviceName: "", remoteSettingType: RemoteSettingCommandType.AlarmSettings, entityType: EntityType.Room };
                console.log('Navigating to room alarm settings', roomData);
                this.nav.navigateForward('remote-settings-page', roomData);
              }
            }
          ]
        })
        await actionSheet.present();       
    }
    async navToGraph(sensor: Sensor) {
        // let modal = this.modalCtrl.create(EntityGraphsPage, {'data': sensor});
        // modal.present();
        console.log(sensor)
       const actionSheet =  await this.actionSheet.create({
         header: "Sensor Navigation",
         buttons: [
           {
             text: 'Alarms',
             handler: () => {
               this.nav.navigateForward('entity-alarms-page', {queryParams: {sensor}});
             }
           },
           {
             text: 'Graph',
             handler: async() => {
               if (this.control.fusionStatus < 13) {
                 const toastController = await this.toastCtrl.create({
                   message: "Can't request graph as control is marked offline",
                   position: 'middle',
                   duration: 5000,
                   buttons: [{ text: 'Close', role: 'cancel' }]
                 })
                 await toastController.present()
                 return;
               }
               this.nav.navigateForward('entity-graphs-page', { queryParams: { sensor } });
             }
           },
           // {
           //     text: 'Sensor Settings',
           //     handler: () => {                        
           //         var sensorData: any = {entityNumber: sensor.sensorSerialNumber, roomId: sensor.controlSerialNumber + "." + sensor.roomProgramId, controlSerialNumber: sensor.controlSerialNumber, controlName: this.control.name, deviceName: sensor.sensorName, remoteSettingType: RemoteSettingCommandType.EntitySettings, entityType: EntityType.Sensor }
           //         console.log('Navigating to sensor settings', sensorData);
           //         this.navCtrl.push('remote-settings-page', sensorData);
           //     }
           // },
           {
             text: 'Alarm Settings',
             handler: async() => {
               if (this.control.fusionStatus < 13) {
                 this.toastCtrl.create({
                   message: "Can't request settings as control is marked offline",
                   position: 'middle',
                   duration: 5000,
                 })
                 actionSheet.present();
                 return;
               }
               var sensorData: any = { entityNumber: sensor.sensorSerialNumber, roomId: sensor.controlSerialNumber + "." + sensor.roomProgramId, controlSerialNumber: sensor.controlSerialNumber, controlName: this.control.name, deviceName: sensor.sensorName, remoteSettingType: RemoteSettingCommandType.AlarmSettings, entityType: EntityType.Sensor };
               console.log('Navigating to Sensor alarm settings', sensorData);
               this.nav.navigateForward('remote-settings-page', sensorData);
             }
           },
           {
             text: 'Cancel',
             role: 'cancel',
           }
         ]
       })
        await actionSheet.present()
    }
    shouldShow(sensor: Sensor): boolean {
        if (sensor.sensorType == SensorType.RemoteSensor) return false;
        if (!this.searchText || this.searchText.trim() == "") return true;
        return (sensor.sensorName.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
            sensor.sensorSerialNumber.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1);
    }
    shouldShowBadge(sensor: Sensor) {
        var ac = this.alarmData.getAlarmCounts(null, sensor.sensorSerialNumber, null);
        if (ac.acknowledgedCount + ac.activeCount == 0) return false;
        return true;
    }
    shouldShowSilentBadge(sensor: Sensor) {
        var ac = this.alarmData.getAlarmCounts(null, sensor.sensorSerialNumber, null);
        if (ac.silentCount == 0) return false;
        return true;
    }
}
