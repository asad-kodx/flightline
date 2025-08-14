import { BaseDataProvider } from "./base-data.provider";
import { Injectable } from "@angular/core";
import { formatString, String } from 'typescript-string-operations';
import { OrgContextService } from "../services/org-context.service";
import { HttpClient } from "@angular/common/http";
// import { notImplemented } from "@angular/core/src/render3/util";
import { Room, Sensor, Device, Control } from "../../shared/models";
import { EMPTY, Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class RoomDataProvider extends BaseDataProvider<Room[]> {

    public roomsListcacheKey: string = "rooms-list-cache";
    public partial_sensorCacheKey: string = "sensors-cache-{0}";
    public partial_deviceCacheKey: string = "devices-cache-{0}";

    private readonly _roomsUrl: string = "/api/dashboard/1/site/205";
    private readonly _roomsForControl: string = `/api/rooms/{0}`; // controlId
    private readonly _devicesForRoom: string = `/api/mobile/device/{0}/groupbyroom`; // controlId;
    private readonly _sensorsForRoom: string = `/api/mobile/sensors/{0}/groupbyroom`; // controlId;

    private entityMap: Map<string, Sensor & Device>;
    public controlsPulled: Map<string, boolean>;
    private checkingMap: Map<string, boolean>

    private getUrl(url: string, parameter: string): string {
        console.log('Get Url', url, parameter, this.configurations.baseUrl + formatString(url, parameter));
        if(parameter) return this.configurations.baseUrl + formatString(url, parameter);
        else return this.configurations.baseUrl + url;
    }

    constructor(http: HttpClient, orgContext: OrgContextService) {
        super(http, orgContext);
        this.entityMap = new Map<string, Sensor & Device>();
        this.checkingMap = new Map<string, boolean>();
        this.controlsPulled = new Map<string, boolean>();
    }

    public getRooms(): Observable<Room[]> {
        return this.getData(this.getUrl(this._roomsUrl, ''));

    }

    getEntity(hardwareId: string){
        if(!this.entityMap.get(hardwareId) && !this.checkingMap.get(hardwareId.split('.')[0])){
            this.checkingMap.set(hardwareId.split('.')[0], true)
            this.getSensorsForControl(hardwareId.split('.')[0])?.subscribe();
            // .catch(() => {
            //     return Observable.of(null);
            // })
            this.getDevicesForControl(hardwareId.split('.')[0])
            // .catch(() => {
            //     return Observable.of(null);
            // })
            .subscribe();
            window.setTimeout(() =>  this.checkingMap.set(hardwareId.split('.')[0], false), 5000)
        }
        return this.entityMap.get(hardwareId);
    }

    public isSensorOrDevice(hardwareId: any){
        var entity = this.entityMap.get(hardwareId);
        if(!entity) return null;
        if(entity.sensorSerialNumber) return "sensor";
        else return "device";
    }
    
 
    public getSensorsForControl(serialNumber: string): Observable<any> {
        if (this.controlsPulled.get(serialNumber)) {
            return EMPTY;
        }

        return this.getDataUncaught(this.getUrl(this._sensorsForRoom, serialNumber)).pipe(
            tap((data: any) => {
            this.controlsPulled.set(serialNumber, true);

            data.forEach((r: any) => {
                r.sensors.forEach((s: any) => {
                s.roomName = r.name;
                this.entityMap.set(s.sensorSerialNumber, s);
                });
                r.sensors = _.sortBy(r.sensors, 'sensorName');
            });

            data = _.sortBy(data, 'roomPlacementIndex');
            localStorage.setItem(`sensors_${serialNumber}`, JSON.stringify(data));
            }),
            map((data: any) => data) // return the processed data
        );
    }
    public getDevicesForControl(serialNumber: string): Observable<Device[]> {
        return this.getDataUncaught(this.getUrl(this._devicesForRoom, serialNumber)).pipe(
            map((data: any) => {
                this.controlsPulled.set(serialNumber, true)
                data.forEach((r: any) => {
                    r.devices.forEach((d: any) => {
                        d.roomName = r.name;
                        this.entityMap.set(d.deviceSerialNumber, d);
                    });
                    r.devices = _.sortBy(r.devices, 'deviceName')
                })
                data = _.sortBy(data, 'roomPlacementIndex')
                localStorage.setItem(`devices_${serialNumber}`, JSON.stringify(data))
                return data;
            })
        );
    }

}