/*********************************************************************
 * Copyright (c) 2020, Controltech Corporation All Rights Reserved.
 *
 * Description: Remote settings provider file
 *********************************************************************/

import { BaseDataProvider } from "./base-data.provider";
import { ConfigurationService } from "../services/configuration.service";
import { HttpClient } from "@angular/common/http";
import { OrgContextService } from "../services/org-context.service";

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RemoteControlProvider extends BaseDataProvider<string> {
    private baseUrl: string = ConfigurationService.baseUrl;

    constructor(http: HttpClient, private orgService: OrgContextService) {
        super(http, orgService);
    }

    private readonly _remoteControlUrl: string = "/api/mobile/remotecontrol"    

    //this endpoint is to talk to non remote setting enabled fusions
    private get remoteControlV1Url(): string { return this.baseUrl + this._remoteControlUrl + "/v2/fusionOldVersion" }
    //this endpoint is to talk to remote setting enabled fusions
    private get remoteControlV2Url(): string { return this.baseUrl + this._remoteControlUrl  + "/v2" }    

    public sendRemoteControlRequest<T>(obj: any, isControlRemoteSettingEnabled: boolean): Observable<T>{
        console.log(obj)
        if(isControlRemoteSettingEnabled) {
            return this.postData(this.remoteControlV2Url, obj);
        }
        else {
            return this.postData(this.remoteControlV1Url, obj);
        }
        
    }
}