import { HubConnection, HubConnectionOptions, HubConnectionFactory } from "../signalr-client";
import { ConfigurationService } from "./configuration.service";
import { Injectable, EventEmitter } from "@angular/core";
import { LogLevel } from "@microsoft/signalr";
import { LiveValueMessage, ControlAlarm, RemoteSettings, Control } from "../../shared/models/index";
import { Network } from "@awesome-cordova-plugins/network/ngx";
import { Platform } from "@ionic/angular";
@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnectionFactory?: HubConnectionFactory;
    private realtimeDataHub?: HubConnection<RealtimeHub>;
    public connected?: boolean;
    public alarmDataReceivedEvent$: EventEmitter<ControlAlarm> = new EventEmitter<ControlAlarm>();
    public siteAlarmDataReceivedEvent$: EventEmitter<ControlAlarm> = new EventEmitter<ControlAlarm>();
    public liveValueMessageReceived$: EventEmitter<LiveValueMessage> = new EventEmitter<LiveValueMessage>();
    public liveHistoryReceived$: EventEmitter<any> = new EventEmitter<any>();
    public sendRemoteControlResults: EventEmitter<any> = new EventEmitter<any>();
    public receiveControlRemoteSettings: EventEmitter<RemoteSettings> = new EventEmitter<RemoteSettings>();
    public receiveRemoteSettingsAcknowledgement: EventEmitter<any> = new EventEmitter<any>();
    public sendExtendedRoomData: EventEmitter<any> = new EventEmitter<any>();
    public sendControlUpdate$: EventEmitter<Control> = new EventEmitter<Control>();

    constructor(private platform: Platform, private network: Network) {
        this.hookPlatformEvents();
    }
    public connect() {
        this.hubConnectionFactory = new HubConnectionFactory();
        this.hubConnectionFactory.create(this.hubOptions);
        if(!localStorage.getItem('auth_token')) return;
        if(this.realtimeDataHub) return;
        this.realtimeDataHub = this.hubConnectionFactory.get('realtimedatahub');

        this.realtimeDataHub.connect()
        .subscribe(() => {
            console.log("connected")
            this.setupSubscriptions();

            this.connected = true
        }, err => {
            this.connected = true;
        });
    }
    public disconnect() {
        this.connected = false;
        this.realtimeDataHub?.disconnect().subscribe(() => {
            this.realtimeDataHub = undefined;
            this.hubConnectionFactory = undefined;
        });
        
    }
    private get hubOptions(): HubConnectionOptions {
        return {
            key: 'realtimedatahub',
            endpointUri: `${ConfigurationService.baseUrl}/signalr/realtimedatahub`,
            options: {
                logger: LogLevel.Debug,
                accessTokenFactory: () => localStorage.getItem('auth_token') || '',
                logMessageContent: true,
                retry: {
                    maximumAttempts: 100
                }
            },
            data: {},
        }
    }
    private setupSubscriptions() {
        this.realtimeDataHub?.on<LiveValueMessage>('SendLiveValues').subscribe((data: LiveValueMessage) => {
            this.liveValueMessageReceived$.emit(data);            
        });
        this.realtimeDataHub?.on<any>('SendControlStatus').subscribe((data: any) => {            
            this.sendControlUpdate$.emit(data);
        });

        this.realtimeDataHub?.on<ControlAlarm>('SendSiteAlarmUpdate').subscribe((data: ControlAlarm) => {
            this.alarmDataReceivedEvent$.emit(data);
        })
        this.realtimeDataHub?.on('SendLiveHistory').subscribe (data => {
            this.liveHistoryReceived$.emit(data);
        });
        this.realtimeDataHub?.on('SendRemoteControlResultToClients').subscribe((data: any) => {
            this.sendRemoteControlResults.emit(data);
        });
        this.realtimeDataHub?.on('SendControlRemoteSettingsBlob').subscribe((data: any) => {
            this.receiveControlRemoteSettings.emit(data);
        });
        this.realtimeDataHub?.on('SendControlRemoteSettingsUpdateAcknowledge').subscribe((data: any) => {
            this.receiveRemoteSettingsAcknowledgement.emit(data);
        });
        this.realtimeDataHub?.on<any>('SendExtendedRoomData').subscribe((data: any) => {            
            this.sendExtendedRoomData.emit(data);
        });
    }
    private hookPlatformEvents(){
        this.network.onDisconnect().subscribe(() => {
            if(this.realtimeDataHub) this.disconnect();
            this.realtimeDataHub = undefined;
            console.log("Signal r disconnected event occured",this.realtimeDataHub)
        });
        this.network.onConnect().subscribe(() => {
            console.log("Signal r connect event occuring", this.realtimeDataHub)
            if(!this.realtimeDataHub) this.connect();
            console.log("Signal r connected event occured", this.realtimeDataHub)
        });
        this.platform.resume.subscribe(() => {
            console.log("Signal r resume event occuring", this.realtimeDataHub)
            if(!this.realtimeDataHub) this.connect();
            console.log("Signal r resume event occured", this.realtimeDataHub)
        });
        this.platform.pause.subscribe(() => {
            console.log("Signal r pause event occuring", this.realtimeDataHub);
            if(this.realtimeDataHub) this.disconnect();
            this.realtimeDataHub = undefined;
            console.log("Signal r pause event occured", this.realtimeDataHub);
        })
    }
}
export interface RealtimeHub {
    ClaimUpdate: any;
    SendLiveValue: any;
    SendLiveValues: any;
    SendLiveHistory: any;
    SendControlStatus: any;
    SendLiveUserUpdate: any;
    SendExtendedRoomData: any;
    SendAlarmUpdate: any;
    SendSiteAlarmUpdate: any;
    SendRemoteControlResultToClients: any;
    SendControlRemoteSettingsBlob: any;
    SendControlRemoteSettingsUpdateAcknowledge: any;
}