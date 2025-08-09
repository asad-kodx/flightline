export class Organization {
    organizationId?: number;
    name?: string;
    phoneNumber?: string;
    sites?: any;
    controls?: any;
    organizationUsers?: any;
    alarms?: any;

    constructor(name: string, id: number){
        this.name = name;
        this.organizationId = id;
    }
}