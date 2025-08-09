/*********************************************************************
 * Copyright (c) 2020, Controltech Corporation All Rights Reserved.
 *
 * Description: Remote settings service
 *********************************************************************/

import { Events, Toast, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { SignalRService } from './signalr.service';
import { RemoteSettingCommandType } from '../models/types/remote-settings-command-type';
import { RemoteSettingsProvider } from '../providers/remote-settings-provider';
import { EntityType } from '../models/types/entity-type';
import { RemoteHeader } from '../models/remote-header-model';
import { Setting } from '../models/remote-setting-update-model';
import { RemoteSettings } from '../models/remote-setting-model'



@Injectable()
export class RemoteSettingsService {

    public activeGetRequests: Map<string, any>;
    public activeApplyRequests: Map<string, any>;
    /**
     * Creates a new instance of this service class
     * @param events Ionic events service
     * @param signalR SignalR service
     * @param remoteSettingsProvider Provider for remote settings
     */
    constructor(private events: Events, private signalR: SignalRService, private remoteSettingsProvider: RemoteSettingsProvider) {
        this.setupGetRemoteSettingsBlobSubscription();
        this.setupRemoteSettingsUpdatedAcknolwedgeSubscription();
        this.activeGetRequests = new Map<string, any>();
        this.activeApplyRequests = new Map<string, any>();
    }

    /**
     * Sends a get remote settings through the server to fusion
     * @param remoteHeader Information about the remote header request
     * @param commandType Type of settings requested (Entity or Alarm)
     * @param entityType Type of entity settings request (Sensor, Device or Alarm)
     */
    requestRemoteSettings(remoteHeader: RemoteHeader, commandType: RemoteSettingCommandType, entityType: EntityType) {
        var obj = { remoteHeader, remoteSettingCommandType: commandType, entityType: entityType };
        //console.log('Sending request to control', obj);
        this.remoteSettingsProvider.requestRemoteSettingFromControl<any>(obj)
            .subscribe(
                res => {
                    console.log("active get requests",this.activeGetRequests);
                    if(this.activeGetRequests.has(res.requestId)) {
                        this.events.publish('receiveRemoteSettings', this.activeGetRequests.get(res.requestId));
                    }
                    else {
                        this.activeGetRequests.set(res.requestId, "");
                    }                    
                }
            )
    }

    /**
     * Gets the requested settings from fusion as a signalR message
     */
    setupGetRemoteSettingsBlobSubscription() {
        this.signalR.receiveControlRemoteSettings.subscribe((data: RemoteSettings) => {
            //console.log('Received Remote Settings from control', data);
            if (this.activeGetRequests.has(data.requestId)) {
                this.activeGetRequests.delete(data.requestId);
                this.activeGetRequests.set(data.requestId, data);
                this.events.publish('receiveRemoteSettings', data);
            }
            else {
                this.activeGetRequests.set(data.requestId, data);
            }            
        })
    }

    /**
     * Sends an apply remote settings post request through the server to fusion
     * @param remoteHeader Information about the apply settings request
     * @param updatedSettings Settings changed by the user
     * @param commandType Type of settings requested (Entity or Alarm)
     * @param entityType Type of entity settings request (Sensor, Device or Alarm)
     */
    postUpdatedRemoteSettings(remoteHeader: RemoteHeader, updatedSettings: Setting[], commandType: RemoteSettingCommandType, entityType: EntityType) {
        var obj = { remoteHeader, remoteSettingCommandType: commandType, entityType: entityType, settings: updatedSettings };
        //console.log('Sending updated settings to control', obj);
        this.remoteSettingsProvider.postUpdatedRemoteSettingsFromControl<any>(obj)
            .subscribe(
                res => {
                    console.log("active set requests",this.activeApplyRequests);
                    if (this.activeApplyRequests.has(res.requestId)) {
                        this.events.publish('receivedRemoteSettingsAcknowledgement', this.activeApplyRequests.get(res.requestId));
                    }
                    else {
                        this.activeApplyRequests.set(res.requestId, "");
                    }                    
                }
            )
    }

    /**
     * Gets the acknowledgement response from fusion after applying settings as a signalR message
     */
    setupRemoteSettingsUpdatedAcknolwedgeSubscription() {
        this.signalR.receiveRemoteSettingsAcknowledgement.subscribe(data => {
            //console.log('Received remote settings updated acknowledgement from control', data);

            if (this.activeApplyRequests.has(data.requestId)) {
                this.activeApplyRequests.delete(data.requestId);
                this.activeApplyRequests.set(data.requestId, data);
                this.events.publish('receivedRemoteSettingsAcknowledgement', data);
            }
            else {
                this.activeApplyRequests.set(data.requestId, data);
            }
        })
    }
}