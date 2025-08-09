import { RemoteControlStatusCode } from './types/remote-settings-status-code';

export interface RemoteSettingUpdateAcknowledgement {
    controlSerialNumber: number
    entityId: string;
    timeStamp: string;
    userId: string;
    requestId: string;
    pin: number;
    connectionId: string;
    statusCode: RemoteControlStatusCode;
    statusDescription: string;
}