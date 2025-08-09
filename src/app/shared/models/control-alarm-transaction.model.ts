import { AlarmAction } from "./types/alarm-action";

export interface Transaction{
    transactionId: number;
    fusionTransactionKey: string;
    alarmAction: AlarmAction;
    actionType: number;
    initiatedById: string;
    intiatedByName: string;
    assignedToId: string;
    assignedToName: string;
    timeOfAction: Date;
    created: any;
    assignedToUsername: string;
    initiatedByUserName: string;
    autoResolved: boolean;
}