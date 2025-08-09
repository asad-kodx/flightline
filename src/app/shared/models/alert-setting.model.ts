import { EntityType } from "./types/entity-type";
import { SensorType } from "./types/sensor-type";
import { DeviceType } from "./types/device-type";
import { CompareType } from "./types/compare-type";

export interface AlertSetting{
    alertSettingId: number;
    entityId: string;
    entityType: EntityType;
    sensorOrDeviceType: SensorType | DeviceType;
    entityName: string;
    active: boolean;
    setValue: number;
    displayValue: any;
    compareType: CompareType;
    
    //Comparative Properties
    storedValue: number;
    storedDirection: string;
    direction: string;
    controlName: string;
    controlSerialNumber: string;
}