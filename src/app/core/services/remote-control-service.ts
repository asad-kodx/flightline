import { interval, of, Subject } from 'rxjs';
import { take } from "rxjs/operators";
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ConfigurationService } from "./configuration.service";
import * as Moment from 'moment';
import { SignalRService } from './signalr.service';
import { RemoteControlProvider } from '../providers/remote-control.provider';

import { RemoteControlCommandType, FusionFeatureFlag, StatusCode, DeviceType, Mode } from "../../shared/models";

@Injectable({
    providedIn: 'root'
})
export class RemoteControlService {

    private config = ConfigurationService;

    private activeRequests: Map<string, string>;
    private timedOutRequests: Map<string, string>;
    private requestTimes: Map<string, any>;
    private slowRequests: Map<string, any>;
    private requestLog: string[];
    private toast: any;
    
    // Observable subject for request ID checks
    private requestIdCheckSubject = new Subject<any>();
    public requestIdCheck$ = this.requestIdCheckSubject.asObservable();
    private getRequestIdSubject = new Subject<any>();
    public getRequestId$ = this.getRequestIdSubject.asObservable(); 
    private requestTimeoutSubject = new Subject<string>();
    public requestTimeout$ = this.requestTimeoutSubject.asObservable();
    private postFailedSubject = new Subject<string>();
    public postFailed$ = this.postFailedSubject.asObservable();
    
    constructor(private toastCtrl: ToastController, private signalr: SignalRService, private remoteControlProvider: RemoteControlProvider) {
        this.activeRequests = new Map<string, string>();
        this.timedOutRequests = new Map<string, string>();
        this.requestTimes = new Map<string, any>();
        this.slowRequests = new Map<string, any>();
        this.requestLog = [];
        this.setUpEventSubscription();
    }

    ngOnInit() {

    }

    sendChanges(deviceId: string, mode: Mode, value: any, commandType: RemoteControlCommandType, fusionFeatureFlag: number) {
        var time = Moment();
        var isRemoteSettingEnabled = false;
        var obj;
        //check feature flag to determine the type of remote control request to be sent to fusion
        if((fusionFeatureFlag & FusionFeatureFlag.RemoteSettings) == FusionFeatureFlag.RemoteSettings) {
            isRemoteSettingEnabled = true;
            var serialNumber = 0;
            if(deviceId != null) {
                serialNumber = Number(deviceId.split(".")[0]);
            }
            obj = { ControlSerialNumber: serialNumber, EntityId: deviceId, Mode: mode, Value: value, ConnectionId: "noconnection", RemoteControlCommandType: commandType};
        }
        else {
            isRemoteSettingEnabled = false;
            obj = { DeviceId: deviceId, Mode: mode, Value: value, ConnectionId: "noconnection", RemoteControlCommandType: commandType};
        }        
        this.remoteControlProvider.sendRemoteControlRequest<any>(obj, isRemoteSettingEnabled)
            .subscribe({
                next: (res: any) => {
                    console.log(res)
                    var requestId = res.requestId;
                    console.log('Post Returned', requestId, this.slowRequests)
                    if (this.slowRequests.has(requestId)) {
                        this.handleSlowRequest(time, deviceId, this.slowRequests.get(requestId), requestId);
                        return;
                    }
                    this.requestTimes.set(requestId, time);
                    this.activeRequests.set(deviceId, requestId);
                    console.log(this.activeRequests)
                    this.getRequestIdSubject.next(requestId);
                    this.timedOutRequests.delete(deviceId);
                    interval(30000).pipe(take(1)).subscribe(() => {
                        if (this.activeRequests.get(deviceId) == requestId) {
                            this.timedOutRequests.set(deviceId, requestId);
                            this.activeRequests.delete(deviceId);
                            this.requestTimeoutSubject.next('RequestTimeout');
                        }
                    });
                },
                error: (error: any) => {
                    this.postFailedSubject.next('PostFailed')
                    console.error(error)
                    return of(null);
                }
            });
    }

    handleSlowRequest(startTime: any, deviceId: string, requestInfo: any, requestId: string) {
        console.log("Handling slow request")
        var requestTime = requestInfo.time.diff(startTime, 'milliseconds');
        this.handleError(requestInfo.statusCode);
        this.getRequestIdSubject.next(requestId);
    }

    getRequestId(deviceId: string): string {
        return this.activeRequests.get(deviceId) || '';
    }

    isTimedOut(deviceId: string): boolean {
        return this.timedOutRequests.has(deviceId)
    }

    getRequestLog() {
        return this.requestLog;
    }

    getDeviceType(deviceType: DeviceType, version?: string, featureFlag: FusionFeatureFlag | null = null) {
        if(deviceType == null) return null;
        if (featureFlag == null) return null;
        switch (deviceType) {
            case DeviceType.DualRelayCardBooleanFanDevice:
            case DeviceType.OctoRelayCardBooleanFanDevice:
            case DeviceType.DualRelayCardBooleanFoggerDevice:
            case DeviceType.QuadRelayCardBooleanFanDevice:
            case DeviceType.QuadRelayCardBooleanFoggerDevice:
            case DeviceType.QuadRelayCardBooleanHeaterDevice:
            case DeviceType.QuadRelayCardBooleanMotorDevice:
            case DeviceType.DualRelayCardBooleanMotorDevice:
            case DeviceType.BooleanRelayMotorDevice:
            case DeviceType.DualRelayCardBooleanHeaterDevice:
            case DeviceType.OctoRelayCardBooleanHeaterDevice:
            case DeviceType.SwitchDevice:
            case DeviceType.ClockDevice:
            case DeviceType.BooleanRelayFoggerDevice:
            case DeviceType.BooleanRelayHeaterDevice:
            case DeviceType.BooleanRelayMotorDevice:
            case DeviceType.BooleanRelayFanDevice:
            case DeviceType.GenericBooleanMotorDevice:
            case DeviceType.BooleanDoserDevice:
            case DeviceType.BooleanValveDevice:
                return "boolean";
            case DeviceType.VariableCardVariableFanDevice:
            case DeviceType.VariableCurrentCardVariableHeaterDevice:
            case DeviceType.VariableCurrentCardVariableFanDevice:
            case DeviceType.VariableCardHeatLampDevice:
            case DeviceType.LightDevice:
            case DeviceType.FanGroupDevice:
            case DeviceType.SlideDevice:
            case DeviceType.VariableDoserDevice:
                return "variable";
            case DeviceType.BallDropDevice:
                return 'curtain'
            case DeviceType.CurtainCardCurtainDevice:
            case DeviceType.CurtainDeviceV2:
                if (Number(version?.split('.')[2]) >= 90) return "curtain2";
                return 'curtain';
            case DeviceType.ChainDiskDevice:
            case DeviceType.GenericProcessDevice:
                if(featureFlag >= FusionFeatureFlag.GenericRemoteControl){
                    return 'chainDisk2'
                }
                return "chainDisk";
            case DeviceType.BinSlideDevice:
                return "binProcess";
            case DeviceType.MixingProcessDevice:
            case DeviceType.BatchTankProcessDevice:
                return 'mixingProcess';
            default:
                return null;
        }
    }

    private setUpEventSubscription() {
        this.signalr.sendRemoteControlResults.subscribe(data => {
            window.setTimeout(() => {
                var processedResponse = this.mapSignalrResponse(data)
                this.handleResponse(processedResponse.deviceId, processedResponse.requestId, processedResponse.statusCode, processedResponse.statusDescription);
                // Emit request ID check via observable
                this.requestIdCheckSubject.next(data);
            }, 1000);
        });
    }
    
    //Map the response based on if it came from a Remote Setting enabled/non remote setting enabled control
    mapSignalrResponse(remoteControlAck: any) : any {        
        if('entityId' in remoteControlAck) {
            return { deviceId: remoteControlAck.entityId, requestId: remoteControlAck.requestId, statusCode: remoteControlAck.statusCode, statusDescription: remoteControlAck.statusDescription }            
        }
        else if('deviceId' in remoteControlAck) {
            return { deviceId: remoteControlAck.deviceId, requestId: remoteControlAck.requestId, statusCode: remoteControlAck.statusCode, statusDescription: remoteControlAck.statusDescription }            
        }
    }

    
  showNotConnectedToast(){
    var t = this.toastCtrl.create({
        message: "The command was not sent due to a lack of connection to control",
        position: 'middle',
        duration: 5000
    })
}

    handleResponse(deviceId: string, requestId: string, statusCode: StatusCode, statusDescription: string) {
        console.log(deviceId, this.activeRequests.has(deviceId), this.slowRequests.has(requestId));
        if (!this.activeRequests.has(deviceId) && !this.slowRequests.has(requestId)) {
            var time = Moment();
            this.slowRequests.set(requestId, { time: time, statusCode: statusCode, statusDescription: statusDescription });
            return;
        }
        this.activeRequests.delete(deviceId);
        this.timedOutRequests.delete(deviceId);

        // LOGGING PURPOSES ONLY
        var requestSentTime = this.requestTimes.get(requestId);
        var requestTime = Moment().diff(requestSentTime, 'milliseconds');
        this.handleError(statusCode);
    }

    displayTimeOutToast() {
         this.toast = this.toastCtrl.create({
            message: "A remote control call for this device has timed out, the control may be unreachable",
            position: 'middle',
            duration: 5000
        });
        this.toast.present();
        this.toast.onDidDismiss(() => {
            this.toast = null;
        })
    }

    displayErrorToast(message: string) {
         this.toast = this.toastCtrl.create({
            message: message,
            position: 'middle',
            duration: 5000
        });
        this.toast.present();
        this.toast.onDidDismiss(() => {
            this.toast = null;
        })
    }

    displaySuccessToast() {
         this.toast = this.toastCtrl.create({
            message: 'Successfully applied the selected changes',
            position: 'bottom',
            duration: 5000
        });
        this.toast.present();
        this.toast.onDidDismiss(() => {
            this.toast = null;
        })
    }

    handleError(statusCode: StatusCode) {
        console.log("Handling error", statusCode)
        var message = "";
        switch (Number(statusCode)) {
            case StatusCode.NoError:
                this.displaySuccessToast();
                return;
            case StatusCode.DeviceNotFound:
                message = "The device was not found on the control";
                this.displayErrorToast(message);
                return;
            case StatusCode.NoUserIdProvided:
                message = "No user id was found, please contact support";
                this.displayErrorToast(message);
                return;
            case StatusCode.NoPinProvided:
                message = "No pin was found for the user, please contact support";
                this.displayErrorToast(message);
                return;
            case StatusCode.NoSuchPin:
                message = "The pin sent to the control did not match any known user, make that the you are in a security group";
                this.displayErrorToast(message);
                return;
            case StatusCode.NoSuchUser:
                message = "The user was not recognized by the control, please ensure that you are in a security group";
                this.displayErrorToast(message);
                return;
            case StatusCode.WrongPin:
                message = "The pin number sent to the control was wrong, please contact support";
                this.displayErrorToast(message);
                return;
            case StatusCode.WrongAccessLevel:
                message = "You do not have a high enough access level to change device settings";
                this.displayErrorToast(message);
                return;
            case StatusCode.Disabled:
                message = "Remote control is disabled on the control";
                this.displayErrorToast(message);
                return;
            default:
                return;
        }
    }
}