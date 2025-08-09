import { AlertSetting } from "./alert-setting.model";
import { AlertState } from "./types/alert-state";
import { AlertType } from "./types/alert-type";

export interface Alert{
    fusionAlertId: number;
    alertType: AlertType;
    alertState: AlertState;
    entityId: string;
    entityName: string;
    roomName: string;
    roomId: number;
    controlSerialNumber: string;
    controlName: string;
    alertDescription: string;
    created: string;
    cleared: string;
    alertSetting: AlertSetting;
}