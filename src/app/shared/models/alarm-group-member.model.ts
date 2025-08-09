import { AlarmGroup } from "./alarm-group.model";

export interface AlarmGroupMember{
    alarmGroupMemberId: number;
    userId: string;
    placement: number;
    alarmGroupId: number;
    alarmGroup: AlarmGroup;
    userUsername: string;

    isSnoozed: boolean;
    isOnline: boolean;
}