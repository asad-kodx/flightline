import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseDataProvider } from './base-data.provider'
import { OrgContextService } from "../services/org-context.service";
import { formatString, String } from 'typescript-string-operations';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { SignalRService } from "../services/signalr.service";
import * as _ from 'lodash'
import { Control, DBKeys } from "../../shared/models";

@Injectable({
    providedIn: 'root'
})
export class ControlDataProvider extends BaseDataProvider<Control[]> {
    public controlsListCacheKey: string = "controls-list-cache";

    private readonly _controlsUrl: string = "/api/mobile/controls";
    private readonly _controlsByUserUrl: string = "/api/controls/user";
    private readonly _controlByIdUrl: string = `api/controls/{0}`;
    private readonly _controlsByOrgUrl: string = `/api/mysites/{0}/mycontrols`;
    private readonly _startVnc: string = `/api/controls/{0}/startvnc`;
    private readonly _addControlUrl: string = '/api/organization/{0}/controls';
    private readonly _favoritesUrl: string = '/api/mobile/favorites/{0}';
    private readonly _userSettingsUrl: string = '/api/mobile/usersettings';
    private readonly _controlBySno: string = '/api/mobile/controls/get/{0}'
    private readonly _checkSerialNumberUrl: string = '/api/controls/checkserial/{0}';

    private controlsMap: Map<number, Control>;

    private get controlsUrl(): string { return this.configurations.baseUrl + this._controlsUrl; }
    private get controlsByUserUrl(): string { return this.configurations.baseUrl + this._controlsByUserUrl; }
    private get controlByIdUrl(): string { return this.configurations.baseUrl + this._controlByIdUrl; }
    private get controlsByOrganizationUrl(): string { return this.configurations.baseUrl + this._controlsByOrgUrl; }
    private get startVncUrl(): string { return this.configurations.baseUrl + this._startVnc; }
    private get addControlUrl(): string { return this.configurations.baseUrl + this._addControlUrl; }
    private get favoritesUrl(): string { return this.configurations.baseUrl + this._favoritesUrl; }
    private get userSettingsUrl(): string { return this.configurations.baseUrl + this._userSettingsUrl; }
    private get controlsBySnoUrl(): string { return this.configurations.baseUrl + this._controlBySno; }
    private get checkSerialNumberUrl(): string { return this.configurations.baseUrl + this._checkSerialNumberUrl; }

    constructor(http: HttpClient, private orgContext: OrgContextService, private signalr: SignalRService) {
        super(http, orgContext);

        this.dataStore = { values: [] };
        this._data$ = new BehaviorSubject<Control[]>([]);
        this.data = this._data$.asObservable();

        this.controlsMap = new Map<number, Control>();

        this.signalr.sendControlUpdate$.subscribe((data: any) => {
            this.dataStore!.values.forEach(control => {
                if (control.serialNumber === data.serialNumber) {                        
                    control.status = data.online;
                    control.version = data.version;
                    control.name = data.name;
                    control.fusionStatus = data.fusionStatus;

                    if (data.lastHttpPing) control.lastHttpPing = data.lastHttpPing;
                    if (data.lastMqttPing) control.lastMqttPing = data.lastMqttPing;
                    if (data.fusionStatus) control.fusionStatus = data.fusionStatus;
                }
            });
            this._data$.next(Object.assign({}, this.dataStore).values);
        });
        
    }

    public getControlsBinding(): Observable<Control[]>{
        return this.data;
    }

    public getControlBySerialNo(serialNo: number): Observable<any> {
        var endpointUrl = String.Format(this.controlsBySnoUrl, serialNo);
        return this.getData<any>(endpointUrl);
    }

    public getControls<T>(): Observable<Control[]>{
        var string = localStorage.getItem('controls');
        if (string){
            var ctrls = <Control[]>JSON.parse(string);
            this.dataStore!.values = _.sortBy(ctrls, 'name');
            this._data$.next(Object.assign({}, this.dataStore).values);
        }
      
        return this.getControlsFromServer();
    }

    public updateControls(): Observable<Control[]>{
        return this.data;
    }

    private getControlsFromServer(): Observable<Control[]> {
        if(!localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
            this.waitForOrgId();
            return this.data;
        }
        var endpointUrl = formatString(this.controlsByOrganizationUrl, localStorage.getItem(DBKeys.SELECTED_ORG_ID));
        if(Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)) == -1){
            endpointUrl = this.controlsByUserUrl;
        }
        this.getData<Control[]>(endpointUrl)
            .subscribe((data) => {
                data.forEach(c => this.controlsMap.set(c.serialNumber!, c));
                localStorage.setItem('controls', JSON.stringify(data));
                this.dataStore!.values = _.sortBy(data, 'name');
                this._data$.next(Object.assign({}, this.dataStore).values);
        }, err => {
            var string = localStorage.getItem('controls');
            if (string) {
                var ctrls = <Control[]>JSON.parse(string);
                this.dataStore!.values = ctrls;
                this._data$.next(Object.assign({}, this.dataStore).values);
            }
        });

        return this.data;
    }

    waitForOrgId(){
        if(localStorage.getItem(DBKeys.SELECTED_ORG_ID)){
            this.getControlsFromServer();
        }
        else{
            window.setTimeout(() =>  this.waitForOrgId(), 1000)
        }
    }

    getControl(serialNumber: any){
        return this.controlsMap.get(serialNumber);
    }

    checkSerialNumberExists(serialNumber: string) {
        return this.getData(formatString(this.checkSerialNumberUrl, serialNumber));
    }

    public toggleFavoriteControl(serialNumber: number, addFavorite: boolean) {
        const endpointUrl = formatString(this.favoritesUrl, serialNumber);
        if (addFavorite){
            var idx = this.dataStore!.values.findIndex(c => c.serialNumber == serialNumber);
            this.dataStore!.values[idx].isFavorite = true;
            this._data$.next(Object.assign({}, this.dataStore).values);
            return this.postData<any>(endpointUrl, null);
        }
        var idx2 = this.dataStore!.values.findIndex(c => c.serialNumber == serialNumber);
        this.dataStore!.values[idx2].isFavorite = false;
        this._data$.next(Object.assign({}, this.dataStore).values);
        return this.deleteData<any>(endpointUrl);
    }

    public addIgnoredControl(control: Control){
        const endpointUrl = this.userSettingsUrl + '/addignoredcontrol/' + control.serialNumber;
        return this.postData(endpointUrl, null);
    }

    public removeIgnoredControl(control: Control){
        const endpointUrl = this.userSettingsUrl + '/removeignoredcontrol/' + control.serialNumber;
        return this.postData(endpointUrl, null);
    }

    startVnc<T>(controlId: number): Observable<T> {
        const endpointUrl = formatString(this.startVncUrl, controlId);
        return this.http.post<T>(endpointUrl, null);
    }

}