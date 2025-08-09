import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseDataProvider } from "./base-data.provider";
import { OrgContextService } from "../services/org-context.service";
import { ConfigurationService } from "../services/configuration.service";
import { LiveValueData } from "../../shared/models/index";
import { LocalStorageHelper } from "./storage-helper.provider";
import { SignalRService } from "../services/signalr.service";


@Injectable()
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
    public subscribeToLiveValueStream<T>(serialNumber: number) {
        var endpointUrl = this.baseUrl + this._liveValuesUrl + this._lvSubUrl.replace('{0}', serialNumber.toString());
        return this.postData<T>(endpointUrl, null);
    }

    public subscribeToExtendedDataStream<T>(serialNumber: number){
        var endpointUrl = this.baseUrl + this._liveValuesUrl + this._exSubUrl.replace('{0}', serialNumber.toString());
        return this.postData<T>(endpointUrl, null);
    }

    public requestLiveValuesForControl<T>(serialNumber: number)
    {
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestLiveValuesForControl(serialNumber).subscribe(), 2000);
        }
        var endpointUrl = this.baseUrl + this._liveValuesUrl + this._lvRequestUrl.replace('{0}', serialNumber.toString()).replace('{1}', this.storage.getData('username'));
        return this.postData<T>(endpointUrl, null);
    }

    public requestLiveValuesList(entityIds: string[]){
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestLiveValuesList(entityIds).subscribe(), 2000);
        }
        interface LiveValueRequest {
            serialNumber: string;
            cardIndex: string;
            slotIndex: string;
        }
        var requestList: LiveValueRequest[] = [];
        entityIds.forEach(id => {
            if(id){
                var split = id.split('.');
                var request: LiveValueRequest = { serialNumber: split[0], cardIndex: split[1], slotIndex: split[2] }
                requestList.push(request);
            }
        });

        var endpointUrl = this.baseUrl + this._liveValueListRequestUrl.replace('{0}', localStorage.getItem('username') || '');
        return this.postData(endpointUrl, requestList);
    }

    public requestExtendedLiveValues(controlSerialNumber: number, roomIndex: number){
        if(!this.signalr.connected) {
            this.signalr.connect();
            window.setTimeout(() => this.requestExtendedLiveValues(controlSerialNumber, roomIndex).subscribe(), 2000);
        }
        const endpointUrl = this.baseUrl + this._extendedLiveDataUrl.replace('{0}', controlSerialNumber.toString()).replace('{1}', roomIndex.toString());
        return this.getData(endpointUrl);
    }

    public requestLiveHistory(controlSerialNumber: string, cardIndex: string, slotIndex: string, startTime: Date, endTime: Date, property: string){
        var username = this.storage.getData('username')
        var endpointUrl = this.baseUrl + this._historyRequestUrl
            .replace('{0}', controlSerialNumber)
            .replace('{1}', cardIndex)
            .replace('{2}', slotIndex)
            .replace('{3}', property)
            .replace('{4}', startTime.getTime().toString())
            .replace('{5}', endTime.getTime().toString())
            .replace('{6}', username);
        return this.postData(endpointUrl, null);
    }

}