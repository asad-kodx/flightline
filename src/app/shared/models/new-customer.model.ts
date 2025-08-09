import { Site } from "./site.model";

export interface NewCustomer{
    organizationName: string;
    organizationPhoneNumber: number;
    controlSerialNumbers: number[];
    userIds: string[];
    sites: Site[];
}