import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "../services/configuration.service";
import { BaseDataProvider } from "./base-data.provider";
import { OrgContextService } from "../services/org-context.service";
import { Observable, BehaviorSubject } from "rxjs";
import { formatString } from 'typescript-string-operations';
import { SiteContextService } from "../services/site-context.service";

import { DBKeys, Site } from "../../shared/models/index";

@Injectable({
    providedIn: 'root'
})
export class SiteDataProvider extends BaseDataProvider<Site[]> {
    private readonly _sitesUrl: string = "/api/organization/{0}/sites/byuser/minimal";
    private readonly _sitesByUserUrl: string = "/api/sites/byuser/minimal";
    private readonly _sitesMapUrl: string = "/api/usersettings/sitesmap";
    private get sitesUrl(): string { return this.configurations.baseUrl + this._sitesUrl; }
    private get sitesByUserUrl(): string { return this.configurations.baseUrl + this._sitesByUserUrl; }
    private get sitesMapUrl(): string { return this.configurations.baseUrl + this._sitesMapUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector, orgContext: OrgContextService, private siteContext: SiteContextService) {
        super(http, orgContext);

        this.dataStore = { values: [] };
        this._data$ = new BehaviorSubject<Site[]>([]);
        this.data = this._data$.asObservable();

        // this.events.subscribe('UpdateSitesMap', (mapString => {
        //     this.setSitesMap(mapString);
        // }));
    }

    getSitesBinding(): Observable<Site[]> | undefined{
        return this.data;
    }

    getSites<T>() {
        if (!localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
            this.waitForOrgId();
        }
        this.dataStore!.values = JSON.parse(localStorage.getItem('sites') || "[]");
        this._data$.next(Object.assign({}, this.dataStore).values);
        var endpointUrl = formatString(this.sitesUrl, localStorage.getItem(DBKeys.SELECTED_ORG_ID));
        if(Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)) == -1){
            endpointUrl = this.sitesByUserUrl;
        }
        this.getData<Site[]>(endpointUrl).subscribe(sites => {
            this.dataStore!.values = sites;
            this._data$.next(Object.assign({}, this.dataStore).values);
            this.siteContext.newOrgSelected(sites, Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)))
            localStorage.setItem('sites', JSON.stringify(sites));
        });

    }

    waitForOrgId() {
        if (localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
            return this.getSites();
        }
        else {
            window.setTimeout(() => this.waitForOrgId(), 1000)
        }
    }

    getSitesMap() {
        var endpointUrl = this.sitesMapUrl;
        this.getData<string>(endpointUrl).subscribe(setting => {
            this.siteContext.setSitesMapFromServer(setting);
            this.getSites();
        });
    }

    setSitesMap(mapString: string) {
        var endpointUrl = this.sitesMapUrl;
        return this.postData<string>(endpointUrl, { data: mapString}).subscribe();;
    }
}