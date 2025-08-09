import { OfflineAlertSubscriber } from "./offline-alert-subscribers";
import { AlertState } from "./types/alert-state";


export interface OfflineAlert
{
    serialNumber: number;
    name: string;
    offlineTime: any;
    siteName: string;
    siteId: number;
    onlineTime: any;
    state: AlertState;
    isActive: boolean;
    subscribers: OfflineAlertSubscriber[];
}