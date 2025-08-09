import { AlarmGroupMember } from "./alarm-group-member.model";
import { Organization } from "./organization.model";

export interface AlarmGroup{
    siteSiteName: string;
    alarmGroupId: number;
    name: string;
    members: AlarmGroupMember[];
    siteId: number;
    organizationId: number;
    organization: Organization;
}