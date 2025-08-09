import { AlarmState } from "./types/alarm-state";
import { Transaction } from "./control-alarm-transaction.model";
import { AlarmGroup } from "./alarm-group.model";


export interface ControlAlarm {
        controlAlarmId: number;
        fusionAlarmKey: string;
        description: string;
        ackTime: number;
        bumpTime: number;
        state: AlarmState;
        created: Date;
        type: number;
        transactions: Transaction[];
        alarmHistory: string[];
        hardwareId: string;
        assignedToId: string;
        silent: boolean;
        controlId: number;
        siteId: number;
        entityId: string;
        alarmGroupId: number;
    
    
        canAcknowledge: boolean;
        canResolve: boolean;
    
        entityName: string;
        entityHardwareId: string;
        roomName: string;
        roomProgramId: string;
        controlName: string;
        controlSerialNumber: number;
        alarmGroup: AlarmGroup;
        organizationId: number;
        organizationName: string;
        siteSiteName: string;
}