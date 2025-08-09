import { Control } from "./controls-model";

export interface Room {
    roomId?: number;
    name?: string;
    index?: number;
    controlId?: number;
    control?: Control;
    devices?: any;
    roomSensors?: any;
    programId: string;
    collapsed?: boolean;
}