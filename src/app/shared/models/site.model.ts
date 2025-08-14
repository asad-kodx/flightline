import { Control } from "./controls-model";
import { Organization } from "./organization.model";

export class Site{
    siteId: number = 0;
    controls: Control[] = [];
    // users: User[];
    siteName: string = "";
    name: string = "";
    organizationId: number = 0;
    organization: Organization = {};

    userIds: string[] = [];
    controlSerialNumbers: number[] = [];
}