import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "../services/configuration.service";
import { BaseDataProvider } from "./base-data.provider";
import { OrgContextService } from "../services/org-context.service";
import { Observable, BehaviorSubject } from "rxjs";
import { String } from 'typescript-string-operations';
import * as _ from 'lodash'

import { Site, User, Organization, NewCustomer, SoftwareType, DBKeys } from "../../shared/models/index";

@Injectable({
    providedIn: 'root'
})
export class OrganizationDataProvider extends BaseDataProvider<Organization[]> {
    private readonly _orgsUrl: string = "/api/users/{0}/organizations";
    private readonly _newCustomerUrl: string = "/api/organization/newcustomer/true/deviceType/{0}";
    private readonly _getUserUrl: string = "/api/users/{0}";
    private readonly _newControlUrl: string = "/api/sites/{0}/{1}/controls/{2}/create";

    private get orgsUrl(): string { return this.configurations.baseUrl + this._orgsUrl; }
    private get newCustomerUrl(): string { return this.configurations.baseUrl + this._newCustomerUrl; }
    private get getUsersUrl(): string { return this.configurations.baseUrl + this._getUserUrl; }
    private get newControlUrl(): string { return this.configurations.baseUrl + this._newControlUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector, orgContext: OrgContextService) {
        super(http, orgContext);

        this.dataStore = { values: [] };
        this._data$ = new BehaviorSubject<Organization[]>([]);
        this.data = this._data$.asObservable();

        // this.events.subscribe('logout', () => {
        //     this._data$.next([]);
        // })
    }

    getOrganizationsBinding(): Observable<Organization[]> | undefined {
        return this.data;
    }

    getOrganizations<T>() {
        const endpointUrl = String.Format(this.orgsUrl, localStorage.getItem(DBKeys.USER_ID));
        this.dataStore!.values = JSON.parse(localStorage.getItem('orgs') || "[]");
        this._data$.next(Object.assign({}, this.dataStore).values);
        this.getData<Organization[]>(endpointUrl).subscribe(orgs => {
            this.dataStore!.values = _.sortBy(orgs, (o => o.name));
            this._data$.next(Object.assign({}, this.dataStore).values);
            localStorage.setItem('orgs', JSON.stringify(orgs));
        });
    }

    addNewCustomer<T>(newCustomer: NewCustomer): Observable<any> {
        const endpointUrl = String.Format(this.newCustomerUrl, SoftwareType.FUSION_LIGHT);
        var currentUserInfo: User = JSON.parse(localStorage.getItem("user_info") || "{}");
        var newSite: Site =  new Site;
        
        //Add current user and admin user to the org
        newCustomer.userIds = [];
        if (localStorage.getItem("user_id")) 
            newCustomer.userIds.push(localStorage.getItem("user_id")!);
        newCustomer.userIds.push(this.configurations.adminId);
        //Add org name
        newCustomer.organizationName = currentUserInfo.firstName + " " + currentUserInfo.lastName;
        //Add site name
        newSite.name = currentUserInfo.firstName + " " + currentUserInfo.lastName;
        newSite.controlSerialNumbers = [];
        newSite.userIds = [];
        //Add new control to the site
        newSite.controlSerialNumbers.push(newCustomer.controlSerialNumbers[0]);
        //Add current user and admin user to the site
        if (localStorage.getItem("user_id"))
            newSite.userIds.push(localStorage.getItem("user_id")!);
        newSite.userIds.push(this.configurations.adminId);
        //Add site to the org
        newCustomer.sites = [];
        newCustomer.sites.push(newSite);
        return this.postData(endpointUrl, newCustomer);
    }

    addNewControl(serialNumber: any, orgId: any, siteId: any): Observable<Organization>{
        const endpointUrl = String.Format(this.newControlUrl, orgId, siteId, serialNumber);
        return this.postData(endpointUrl, null);
    }
}