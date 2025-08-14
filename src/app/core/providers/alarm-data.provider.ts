import { Injectable } from "@angular/core";
import { BaseDataProvider } from "./base-data.provider";
import { HttpClient } from "@angular/common/http";
import { OrgContextService } from "../services/org-context.service";
import { Observable, BehaviorSubject, of, tap } from "rxjs";
import { ConfigurationService } from "../services/configuration.service";
import { formatString } from 'typescript-string-operations';
import { SignalRService } from "../services/signalr.service";
import * as _ from 'lodash';
import { SiteContextService } from "../services/site-context.service";
import { DBKeys, AlarmCount, ControlAlarm, AlarmState } from "../../shared/models/index";
import { AlertController } from "@ionic/angular";
import { Badge } from "@awesome-cordova-plugins/badge/ngx";

@Injectable({
    providedIn: 'root'
})
export class AlarmDataProvider extends BaseDataProvider<ControlAlarm[]> {
    private alarmsListCacheKey: string = "alarms-list-cache";
    private alarmsListForControlCache: string = "alarms-list-cache-{0}";
    private configuration = ConfigurationService;
    private baseUrl: string = ConfigurationService.baseUrl;
    private readonly _alarmsUrl: string = "/api/mysites/{0}/myalarms";
    private readonly _bumpUrl: string = "/api/v2/alarms/bump/{0}";
    private readonly _acknowledgeUrl: string = "/api/v2/alarms/acknowledge/{0}";
    private readonly _resolveUrl: string = "/api/v2/alarms/resolve/{0}";
    private readonly _singleAlarmUrl: string = "/api/v2/alarms/{0}/mobile";
    private readonly _minAlarmsUrl: string = "/api/mobile/alarms/minimal";
    private readonly _alarmsByUserUrl: string = "/api/v2/alarms/byuser";

    private get alarmsUrl(): string { return this.baseUrl + this._alarmsUrl; }
    private get bumpUrl(): string { return this.baseUrl + this._bumpUrl; }
    private get acknowledgeUrl(): string { return this.baseUrl + this._acknowledgeUrl; }
    private get resolveUrl(): string { return this.baseUrl + this._resolveUrl; }
    private get singleAlarmUrl(): string { return this.baseUrl + this._singleAlarmUrl; }
    private get minAlarmsUrl(): string { return this.baseUrl + this._minAlarmsUrl; }
    private get alarmsByUserUrl(): string { return this.baseUrl + this._alarmsByUserUrl; }

    private alarmCountData: AlarmCount;
    private $alarmCount: BehaviorSubject<AlarmCount>;
    private alarmCount: Observable<AlarmCount>;

    private allAlarmsData: ControlAlarm[];
    private $allAlarms: BehaviorSubject<ControlAlarm[]>;
    private allAlarms: Observable<ControlAlarm[]>;

    private controlAlarmsCountMap: Map<string, {}>;
    private $controlAlarmsCount: BehaviorSubject<Map<string, {}>>;
    public controlAlarmsCount: Observable<Map<string, {}>>;

    private entityAlarmsCountMap: Map<string, {}>;
    private $entityAlarmsCount: BehaviorSubject<Map<string, {}>>;
    public entityAlarmsCount: Observable<Map<string, {}>>;

    private alarmsMap: Map<string, ControlAlarm>;
    private lastCount?: number;

    constructor(http: HttpClient, private orgService: OrgContextService, private signalrService: SignalRService, private siteContext: SiteContextService,
        private alertCtrl: AlertController, private badge: Badge) {
        super(http, orgService)

        this.signalrService.alarmDataReceivedEvent$.subscribe((data: ControlAlarm) => {
            this.alarmRealtimeUpdate(data);
        });

        this.dataStore = { values: [] };
        this._data$ = new BehaviorSubject<ControlAlarm[]>([]);
        this.data = this._data$.asObservable();

        this.allAlarmsData = [];
        this.$allAlarms = new BehaviorSubject<ControlAlarm[]>([]);
        this.allAlarms = this._data$.asObservable();

        this.alarmCountData = new AlarmCount;
        this.$alarmCount = new BehaviorSubject<AlarmCount>(new AlarmCount);
        this.alarmCount = this.$alarmCount.asObservable();

        this.controlAlarmsCountMap = new Map<string, {}>();
        this.$controlAlarmsCount = new BehaviorSubject<Map<string, {}>>(new Map<string, {}>());
        this.controlAlarmsCount = this.$controlAlarmsCount.asObservable();

        this.entityAlarmsCountMap = new Map<string, {}>();
        this.$entityAlarmsCount = new BehaviorSubject<Map<string, {}>>(new Map<string, {}>());
        this.entityAlarmsCount = this.$entityAlarmsCount.asObservable();

        this.alarmsMap = new Map<string, ControlAlarm>();
    }

    public getAlarmsBinding() {
        return this.data;
    }

    public getAlarms<T>(): Observable<ControlAlarm[]> {
        if (!localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
            this.waitForOrgId();
            return this.data;
        }
        var string = localStorage.getItem('alarms');
        if (string) {
            var alrms = <ControlAlarm[]>JSON.parse(string);
            this.dataStore!.values = alrms;
            this._data$.next(Object.assign({}, this.dataStore).values);
        }

        var endpointUrl = formatString(this.alarmsUrl, localStorage.getItem(DBKeys.SELECTED_ORG_ID));
        if(Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)) == -1) endpointUrl = this.alarmsByUserUrl;
        console.log(endpointUrl)
        this.getData<ControlAlarm[]>(endpointUrl)
            .subscribe({
                next: (data) => {
                    data = _.sortBy(data, ['alarmReceiveTime']).reverse();
                    data.map(alarm => alarm.transactions = _.sortBy(alarm.transactions, ['created']).reverse())
                    localStorage.setItem('alarms', JSON.stringify(data));
                    this.dataStore!.values = data;
                    data.forEach(a => this.alarmsMap.set(a.fusionAlarmKey, a));
                    this._data$.next(Object.assign({}, this.dataStore).values);
                },
                error: (err) => {
                    console.error(err)
                    var string = localStorage.getItem('alarms');
                    if (string) { //return of([]);
                        var alrms = <ControlAlarm[]>JSON.parse(string!);
                        this.dataStore!.values = alrms;
                        this._data$.next(Object.assign({}, this.dataStore).values);
                    }
                }
            });


        return this.data;
    }

    waitForOrgId() {
        if (localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
            this.getAlarms();
        }
        else {
            window.setTimeout(() => this.waitForOrgId(), 1000)
        }
    }

    public getAlarmsForControl(controlSerialNumber: number): Observable<ControlAlarm[]> {
        return of(this.dataStore!.values.filter(alarm => alarm.controlSerialNumber === controlSerialNumber));
    }

    public getAlarmsCountForControl(controlSerialNumber: number): Observable<number> {
        return of(this.dataStore!.values.filter(alarm => alarm.controlSerialNumber === controlSerialNumber).length);
    }

    public getSingleAlarm(alarmId: string) {
        var endpointUrl = formatString(this.singleAlarmUrl, alarmId);
        return this.getDataUncaught(endpointUrl).pipe(tap((alarm: any) => {
            this.alarmsMap.set(alarm.fusionAlarmKey, alarm);
        }));
    }

    public bumpAlarm(alarm: ControlAlarm) {
        var endpointUrl = formatString(this.bumpUrl, alarm.fusionAlarmKey);
        return this.postData(endpointUrl, null);
    }

    public getAlarmBySetting(hardwareId: string, alarmType: number) {
        return this.dataStore!.values.find(a => a.hardwareId == hardwareId && a.type == alarmType && a.state != AlarmState.Resolved)
    }

    public acknowledgeAlarm(alarm: ControlAlarm) {
        var endpointUrl = formatString(this.acknowledgeUrl, alarm.fusionAlarmKey);
        return this.postData(endpointUrl, null);
    }

    public resolveAlarm(alarm: ControlAlarm) {
        var endpointUrl = formatString(this.resolveUrl, alarm.fusionAlarmKey);
        return this.postData(endpointUrl, null);
    }

    getAlarmsForEntity(entityId: string): Observable<ControlAlarm[]> {
        return of(this.dataStore!.values)
    }

    getAllAlarmsBinding(){
        return this.allAlarms;
    }

    public getMinimalAlarms() {
        this.allAlarmsData = JSON.parse(localStorage.getItem('allAlarms') || '[]');
        var endpointUrl = this.minAlarmsUrl;
        this.getData(endpointUrl).subscribe((alarms: any) => {
            this.allAlarmsData = _.uniq(alarms);
            localStorage.setItem('allAlarms', JSON.stringify(alarms));

            var count = this.getAllAlarmsCount();
            this.badge.set(count.active + count.acked);
            this.lastCount = count.active + count.acked;

            this.$allAlarms.next(this.allAlarmsData);
        });

    }

    private alarmRealtimeUpdate(alarm: ControlAlarm) {
        this.updateAllAlarms(alarm);
        // if(alarm.organizationId.toString() != localStorage.getItem(DBKeys.SELECTED_ORG_ID)) return;
        let index = this.dataStore!.values.findIndex(al => al.fusionAlarmKey == alarm.fusionAlarmKey);
        if (index == -1) {
            this.dataStore!.values.push(alarm);
        }
        else {
            this.dataStore!.values[index] = alarm;
        }
        this.alarmsMap.set(alarm.fusionAlarmKey, alarm);
        this._data$.next(Object.assign({}, this.dataStore).values);
    }

    private updateAllAlarms(alarm: any) {
        let index = this.allAlarmsData.findIndex(al => al.fusionAlarmKey.toLowerCase() == alarm.fusionAlarmKey.toLowerCase());
        if (index == -1) {
            this.allAlarmsData.push(alarm);
        }
        else {
            this.allAlarmsData[index] = alarm;
        }

        var count = this.getAllAlarmsCount();
        this.badge.set(count.active + count.acked);

    }

    rehandleAlarmCountBadge(){
        var count = this.getAllAlarmsCount();
        this.badge.set(count.active + count.acked);
        this.lastCount = count.active + count.acked;
    }

    getAllAlarmsNotInOrg(orgId: any) {
        return this.allAlarmsData.filter(a => a.state != AlarmState.Resolved && a.organizationId != orgId).length;
    }

    public getAllAlarmsCount(orgId: number | null = null) {
        var count = null;
        if (orgId) {
            count = {
                active: this.allAlarmsData.filter(a => a.state == AlarmState.Active && a.organizationId == orgId).length, 
                acked: this.allAlarmsData.filter(a => a.state == AlarmState.Acknowledged && a.organizationId == orgId).length,
                silent: this.allAlarmsData.filter(a => a.state != AlarmState.Resolved && a.silent && a.organizationId == orgId).length 
            };
    
            return count;
        }
        count = {
            active: this.allAlarmsData.filter(a => a.state == AlarmState.Active && !a.silent).length,
            acked: this.allAlarmsData.filter(a => a.state == AlarmState.Acknowledged && !a.silent).length,
            silent: this.allAlarmsData.filter(a => a.state != AlarmState.Resolved && a.silent).length
        };

        
        if (this.lastCount == null) {
            this.lastCount = count.active + count.acked;
            this.badge.set(count.active + count.acked);
        }

        if (count.active + count.acked != this.lastCount) {
            console.log(this.lastCount, count.active + count.acked)
            this.badge.set(count.active + count.acked);
            this.lastCount = count.active + count.acked;
        }

        return count;
    }

    getAlarmCounts(serialNumber?: number, hardwareId?: string, programId?: string, siteId?: number) {
        var alarmCount = new AlarmCount;
        var alarms = this.dataStore!.values;
        if (serialNumber) alarms = alarms.filter(a => {
            return a.controlSerialNumber == serialNumber && this.siteContext.isSiteSelected(a.siteId)
        });
        else if (hardwareId) alarms = alarms.filter(a => {
            return a.entityHardwareId == hardwareId && this.siteContext.isSiteSelected(a.siteId);
        });
        else if (programId) alarms = alarms.filter(a => {
            return a.roomProgramId == programId && this.siteContext.isSiteSelected(a.siteId);
        })
        else if (siteId) alarms = alarms.filter(a => {
            return a.siteId == siteId;
        });
        else {
            alarms = alarms.filter(a => {
                return this.siteContext.isSiteSelected(a.siteId);
            });
        }

        alarmCount.activeCount = alarms.filter(a => {
            return a.state == AlarmState.Active && !a.silent;
        }).length;

        alarmCount.acknowledgedCount = alarms.filter(a => {
            return a.state == AlarmState.Acknowledged && !a.silent;
        }).length;

        alarmCount.silentCount = alarms.filter(a => {
            return a.state != AlarmState.Resolved && a.silent;
        }).length;


        return alarmCount;
    }

    getAlarm(alarmId: string) {
        return this.alarmsMap.get(alarmId);
    }
}