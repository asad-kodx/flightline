import { Injectable, ViewChild } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { AlertController, MenuController } from "@ionic/angular";
import { HttpService } from "./http-service";
import { RemoteControlService } from "./remote-control-service";
import * as _ from 'lodash'
import { AlarmDataProvider } from "../providers/alarm-data.provider";
import { interval, Subscription } from "rxjs";

import { MessageType, AlarmState, OfflineAlert, ControlAlarm } from "../../shared/models/index";
@Injectable({
  providedIn: 'root'
})
export class PushMessageHandler {

  private alert: any;
  private config = ConfigurationService;
  private pushQueueSub?: Subscription;
  private alarmPushList: ControlAlarm[];

  constructor(private alertCtrl: AlertController, private httpService: HttpService, private menuCtrl: MenuController,
    private remoteControlService: RemoteControlService, private alarmData: AlarmDataProvider) {
      this.alarmPushList = [];
      this.startPushQueue();
  }

  processPushMessage(pushMessage: any, background = false) {
    console.log("Processing push message", pushMessage, background)
    let messageType = _.get(pushMessage.additionalData, ["messageType"]);
    let serialNumber = _.get(pushMessage.additionalData, ["controlSerialNumber"]);

    if (messageType == MessageType.Alarm) {
      let alarmId = <string>_.get(pushMessage.additionalData, ['alarmId']);
      let alarm = _.get(pushMessage.additionalData, ['alarm']);
      alarm = _.mapKeys(alarm, (value, key: string) => {
        key = _.camelCase(key)
        return key;
      })
      console.log("Push Message Type == Alarm")
      let alarmState = <AlarmState>_.get(pushMessage.additionalData, ["alarmState"]);
      console.log("Checking background variable")
      if (background) {
        console.log("From Background should nav")
        this.navToAlarmDetails(alarm);
      }
      else {
        if (alarmState == AlarmState.Active) {
          this.sendAlarmMessage(alarm);
        }
      }
    }

    if (messageType == MessageType.Control) {
      let controlName = <string>_.get(pushMessage.additionalData, ["controlName"]);
      let offlineAlert = pushMessage.additionalData.offlineAlert
      // var string = pushMessage.payload.additionalData.offlineAlert;
      // console.log("Alert string", alert)
      // let offlineAlert = JSON.parse(string);
      // console.log("Alert parsed", offlineAlert)
      offlineAlert.name = controlName;
      if (background) {
        this.navToControlAlertDetails(offlineAlert);
      }
      else {
        console.log("Alert with attached control name", offlineAlert)
        this.sendControlMessage(pushMessage.title, pushMessage.body, offlineAlert);
      }
    }
  }

  sendAlarmMessage(alarm: ControlAlarm) {
    if (this.alert) {
      this.alert.dismiss();
    }
    this.alert = this.alertCtrl.create({
      header: "Alarm Alert",
      message: "You have a new alarm. Do you want to view it?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'View',
          handler: () => {
            console.log("View Pushed Should nav")
            this.navToAlarmDetails(alarm)
          }
        }
      ]
    });

    this.alert.present();
  }

  sendControlMessage(title: string, message: string, offlineAlert: OfflineAlert) {
    if (this.alert) {
      this.alert.dismiss();
    }
    this.alert = this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'View',
          handler: () => {
            this.navToControlAlertDetails(offlineAlert)
          }
        }
      ]
    });

    this.alert.present();
  }

  navToAlarmDetails(alarm: ControlAlarm) {
    // const modal = app._appRoot._modalPortal.getActive();
    console.log("Have Alarm, pushing with alarm", alarm)
    this.addToPushQueue(alarm);
    this.alarmData.getSingleAlarm(alarm.controlAlarmId.toString()).subscribe(alarm => {
      // this.events.publish("AlarmSwitch", alarm)
    })

    // if (modal && modal.dismiss()) {
    //   modal.dismiss();
    // }
    this.menuCtrl.close();
  }

  navToControlAlertDetails(offlineAlert: any) {
    // const modal = app._app._appRoot._modalPortal.getActive();
    offlineAlert.offlineTime = offlineAlert.OfflineTime;
    offlineAlert.onlineTime = offlineAlert.OnlineTime;
    offlineAlert.serialNumber = offlineAlert.SerialNumber;
    offlineAlert.state = offlineAlert.State;
    offlineAlert.isActive = offlineAlert.IsActive;
    offlineAlert.siteName = offlineAlert.SiteName;
    // this.events.publish("AlertNav", offlineAlert);
    // if (modal && modal.dismiss()) {
    //   modal.dismiss();
    // }
    this.menuCtrl.close();
  }

  addToPushQueue(alarm: ControlAlarm){
    this.alarmPushList.push(alarm)
  }

  startPushQueue(){
    if(!this.pushQueueSub) this.pushQueueSub = interval(1000).subscribe(() => {
      if(this.alarmPushList.length > 0){
        console.log("Navving fromg queue", this.alarmPushList[0])
        // this.events.publish('AlarmNav', this.alarmPushList[0]);
        this.alarmPushList.splice(0,1);
      }
    })
  }

  pausePushQueue(){
    this.pushQueueSub?.unsubscribe();
    this.pushQueueSub = undefined;
  }
}
