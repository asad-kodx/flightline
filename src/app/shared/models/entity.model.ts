import { EntityType } from "./types/entity-type";
import { Mode } from "./types/mode";
import { DeviceType } from "./types/device-type";
import { SensorType } from "./types/sensor-type";


export interface Entity{
    entityName: string,
    entitySerialNumber: string,
    roomName: string,
    controlName: string,
    controlSerialNumber: string,
    programId: string,
    entityType: EntityType,
    deviceOrSensorType: number,
    siteId: number,

    liveValueData: any,
    previousValue: any,
    lastUpdated: Date,
    mode: Mode
    amps: number;
    liveValueObject: any;

    deviceName: string,
    sensorName: string,
    deviceSerialNumber: string,
    sensorSerialNumber: string,
    deviceType: DeviceType,
    sensorType: SensorType
}