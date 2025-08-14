/*********************************************************************
 * Copyright (c) 2020, Controltech Corporation All Rights Reserved.
 *
 * Description: Remote settings provider
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
export class RemoteSettingsProvider extends BaseDataProvider<string> {
    private baseUrl: string = ConfigurationService.baseUrl;

    constructor(http: HttpClient, private orgService: OrgContextService) {
        super(http, orgService);
    }

    private readonly _requestRemoteSettingsUrl: string = "/api/mobile/remotecontrol/requestControlSettings";
    private readonly _postUpdatedSettingsUrl: string = "/api/mobile/remotecontrol/changeControlSettings"    

    private get getRequestRemoteSettingsUrl(): string { return this.baseUrl + this._requestRemoteSettingsUrl; }
    private get getPostUpdatedSettingsUrl(): string { return this.baseUrl + this._postUpdatedSettingsUrl; }

    /**
     * Sends the get settings request to server
     * @param obj payload for the server to request settings from fusion
     */
    public requestRemoteSettingFromControl<T>(obj: any): Observable<T> {
        console.log(obj);
        return this.postData(this.getRequestRemoteSettingsUrl, obj);
    }

    /**
     * Sends the apply settings request to server
     * @param obj payload for the server for applying changed settings to fusion
     */
    public postUpdatedRemoteSettingsFromControl<T>(obj: any): Observable<T> {
        console.log(obj);
        return this.postData(this.getPostUpdatedSettingsUrl, obj);
    }

    
}