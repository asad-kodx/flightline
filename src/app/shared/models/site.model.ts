import { Control } from "./controls-model";
import { Organization } from "./organization.model";

export interface Site{
    siteId: number;
    controls: Control[];
    // users: User[];
    siteName: string;
    name: string;
    organizationId: number;
    organization: Organization;

    userIds: string[];
    controlSerialNumbers: number[];
}