import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseDataProvider } from "./base-data.provider";
import { OrgContextService } from "../services/org-context.service";
import { ConfigurationService } from "../services/configuration.service";
import { LiveValueData } from "../../shared/models/index";
import { LocalStorageHelper } from "./storage-helper.provider";
import { SignalRService } from "../services/signalr.service";
import { formatString } from "typescript-string-operations";


@Injectable({
    providedIn: 'root'
})
export class LiveValuesSubscription extends BaseDataProvider<LiveValueData> {
    constructor(http: HttpClient, orgService: OrgContextService, private storage: LocalStorageHelper, private signalr: SignalRService){
        super(http, orgService)
    }

    private readonly baseUrl: string = ConfigurationService.baseUrl;
    private readonly _liveValuesUrl: string = "/api/mobile/livevalues";
    private readonly _lvSubUrl: string = "/subscribelivevalues/{0}";
    private readonly _lvsSubUrl: string = "/subscribelivevalueslist";
    private readonly _lvRequestUrl: string = '/requestlivevalues/{0}/{1}'
    private readonly _historyRequestUrl: string = '/api/mobile/livevalues/requestlivehistory/{0}/{1}/{2}/{3}/{4}/{5}/{6}';
    private readonly _liveValueListRequestUrl: string = '/api/mobile/livevalues/requestlivevaluelist/{0}';
    private readonly _extendedLiveDataUrl: string = "/api/extendedlivedata/{0}/{1}";

    private readonly _exSubUrl: string = "/subscribeextended/{0}";

    public subscribeToLiveValuesStreams<T>(serialNumbers:Array<number>)
    {
        var endpointUrl = this.baseUrl + this._liveValuesUrl + this._lvsSubUrl;
        return this.postData<T>(endpointUrl, serialNumbers);

    }
    public subscribeToLiveValueStream<T>(serialNumber: any) {
        var endpointUrl = this.baseUrl + this._liveValuesUrl + formatString(this._lvSubUrl, serialNumber);
        return this.postData<T>(endpointUrl, null);
    }

    public subscribeToExtendedDataStream<T>(serialNumber: any){
        var endpointUrl = this.baseUrl + this._liveValuesUrl + formatString(this._exSubUrl, serialNumber);
        return this.postData<T>(endpointUrl, null);
    }

    public requestLiveValuesForControl<T>(serialNumber: any)
    {
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestLiveValuesForControl(serialNumber).subscribe(), 2000);
        }
        var endpointUrl = this.baseUrl + this._liveValuesUrl + formatString(this._lvRequestUrl, serialNumber, this.storage.getData('username'));
        return this.postData<T>(endpointUrl, null);
    }

    public requestLiveValuesList(entityIds: string[]){
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestLiveValuesList(entityIds).subscribe(), 2000);
        }
        var requestList: any = [];
        entityIds.forEach(id => {
            if(id){
                var split = id.split('.');
                var request = { serialNumber: split[0], cardIndex: split[1], slotIndex: split[2] }
                requestList.push(request);
            }
        });
        
        var endpointUrl = this.baseUrl + formatString(this._liveValueListRequestUrl, localStorage.getItem('username'));
        return this.postData(endpointUrl, requestList);
    }

    public requestExtendedLiveValues(controlSerialNumber: any, roomIndex: any){
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestExtendedLiveValues(controlSerialNumber, roomIndex).subscribe(), 2000);
        }
        const endpointUrl = formatString(this.baseUrl + this._extendedLiveDataUrl, controlSerialNumber, roomIndex);
        return this.getData(endpointUrl);
    }

    public requestLiveHistory(controlSerialNumber: string, cardIndex: string, slotIndex: string, startTime: Date, endTime: Date, property: string){
        var username = this.storage.getData('username')
        var endpointUrl = this.baseUrl + formatString(this._historyRequestUrl, controlSerialNumber, cardIndex, slotIndex, property, startTime.getTime(), endTime.getTime(), username);
        return this.postData(endpointUrl, null);
    }

}