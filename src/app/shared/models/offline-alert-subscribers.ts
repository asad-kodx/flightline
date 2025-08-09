import { AlertState } from "./types/alert-state";

export interface OfflineAlertSubscriber{
    offlineAlertSubscriberId : number;
    userId?: string;
    state?: AlertState;
    offlineAlertId: number;
}