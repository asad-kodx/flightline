import { SensorRooms } from "./sensor-rooms-model";
import { ControlAlarm } from "./control-alarm-model";
import { Control } from "./controls-model";
import { SensorType } from "./types/sensor-type";

export interface Sensor {
    roomProgramId?: number;
    sensorType?: SensorType;
    sensorRooms?: SensorRooms[];
    entityId?: number;
    hardwareId?: string;
    name?: string;
    controlId?: number;
    control?: Control;
    alarms?: ControlAlarm[];
    liveValueData: any;
    sensorSerialNumber: string;
    sensorName: string;

    controlName: string;
    controlSerialNumber: number;
    roomName: string;

    entityName: string;
    entitySerialNumber: string;
}