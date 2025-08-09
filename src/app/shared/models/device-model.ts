import { Room } from "./room-model";
import { Control } from "./controls-model";
import { ControlAlarm } from "./control-alarm-model";
import { DeviceType } from "./types/device-type";

export interface Device {
    entityId?: number;
    hardwareId?: string;
    roomProgramId?: number;
    enabled?: boolean;
    mode?: number;
    type?: number;
    roomId?: number;
    room?: Room;
    name?: string;
    controlId?: number;
    control?: Control;
    alarms?: ControlAlarm[];
    liveValueData: any;
    liveValueObject: any;
    amps: number;
    deviceSerialNumber: string;
    deviceType: DeviceType;
    deviceName: string;
    hideManualControl: boolean;

    controlName: string;
    controlSerialNumber: number;
    roomName: string;

    entityName: string;
    entitySerialNumber: string;
}