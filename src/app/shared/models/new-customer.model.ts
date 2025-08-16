import { Site } from "./site.model";

export class NewCustomer{
    organizationName: string = '';
    organizationPhoneNumber: number = 0;
    controlSerialNumbers: number[] = [];
    userIds: string[] = [];
    sites: Site[] = [];
}