/*********************************************************************
 * Copyright (c) 2020, Controltech Corporation All Rights Reserved.
 *
 * Description: Remote settings service
 *********************************************************************/

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SignalRService } from './signalr.service';
import { Subject } from 'rxjs';

import {
  RemoteSettingCommandType,
  EntityType,
  RemoteHeader,
  Setting,
  RemoteSettings
} from '../../shared/models/index';
import { RemoteSettingsProvider } from "../providers/remote-settings-provider";



@Injectable({
    providedIn: 'root'
})
export class RemoteSettingsService {

    public activeGetRequests: Map<string, any>;
    public activeApplyRequests: Map<string, any>;

    // Observable subjects for events
    private remoteSettingsReceivedSubject = new Subject<RemoteSettings>();
    private remoteSettingsAcknowledgementSubject = new Subject<any>();
    private requestSettingsAcknowledgementSubject = new Subject<any>();
    private applySettingsAcknowledgementSubject = new Subject<any>();

    // Public observables
    public remoteSettingsReceived$ = this.remoteSettingsReceivedSubject.asObservable();
    public remoteSettingsAcknowledgement$ = this.remoteSettingsAcknowledgementSubject.asObservable();
    public requestSettingsAcknowledgement$ = this.requestSettingsAcknowledgementSubject.asObservable();
    public applySettingsAcknowledgement$ = this.applySettingsAcknowledgementSubject.asObservable();
    /**
     * Creates a new instance of this service class
     * @param events Ionic events service
     * @param signalR SignalR service
     * @param remoteSettingsProvider Provider for remote settings
     */
    constructor(private signalR: SignalRService, private remoteSettingsProvider: RemoteSettingsProvider) {
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
                        this.requestSettingsAcknowledgementSubject.next(this.activeGetRequests.get(res.requestId));
                    }
                    else {
                        this.activeGetRequests.set(res.requestId, "");
                        this.requestSettingsAcknowledgementSubject.next(res.requestId);
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
                this.remoteSettingsReceivedSubject.next(data);
            }
            else {
                this.activeGetRequests.set(data.requestId, data);
                this.remoteSettingsReceivedSubject.next(data);
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
                        this.applySettingsAcknowledgementSubject.next(this.activeApplyRequests.get(res.requestId));
                    }
                    else {
                        this.activeApplyRequests.set(res.requestId, "");
                        this.applySettingsAcknowledgementSubject.next(res.requestId);
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
                this.remoteSettingsAcknowledgementSubject.next(data);
            }
            else {
                this.activeApplyRequests.set(data.requestId, data);
                this.remoteSettingsAcknowledgementSubject.next(data);
            }
        })
    }
}