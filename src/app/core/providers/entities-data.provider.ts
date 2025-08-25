import { BaseDataProvider } from "./base-data.provider";
import { Injectable } from "@angular/core";
import { formatString, String } from 'typescript-string-operations';
import { OrgContextService } from "../services/org-context.service";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { EntityType, Entity, DBKeys } from "../../shared/models";

import * as _ from 'lodash';

@Injectable(
    { providedIn: 'root' }
)
export class EntitiesDataProvider extends BaseDataProvider<Entity[]> {

    private readonly _roomsUrl: string = "/api/mobile/rooms/{0}/{1}/{2}";
    private readonly _liveValuesByGroupUrl: string = '/api/mobile/livevalues/requestlivevaluelist/{0}';

    private getUrl(url: string, parameter: string): string {
        console.log('Get Url', url, parameter, this.configurations.baseUrl + formatString(url, parameter));
        if(parameter) return this.configurations.baseUrl + formatString(url, parameter);
        else return this.configurations.baseUrl + url;
    }

    constructor(http: HttpClient, orgContext: OrgContextService) {
        super(http, orgContext);
        this.dataStore = {values: []}
    }

    getEntities(searchTerm: string, entityType: EntityType): Observable<Entity[]>{
        if (searchTerm == "Bin") searchTerm = "Bins";
        console.log(this.configurations.baseUrl + formatString(this._roomsUrl, entityType, searchTerm))
        return this.getData<Entity[]>(this.configurations.baseUrl + formatString(this._roomsUrl, localStorage.getItem(DBKeys.SELECTED_ORG_ID), entityType, searchTerm))
            .pipe(
                map((data: Entity[]) => {
                    this.dataStore.values = _.sortBy(data, 'entityName');
                    const entityIds = data.map(entity => entity.entitySerialNumber);
                    this.getLiveValuesList(entityIds);
                    return this.dataStore.values;
                }),
                catchError(error => {
                    console.error('Error fetching entities', error);
                    return of([]);
                })
            )
    }

    public getLiveValuesList(entityIds: string[]) {
        const requestList: { serialNumber: string, cardIndex: string, slotIndex: string }[] = [];
        entityIds.forEach(id => {
            var split = id.split('.');
            var request = { serialNumber: split[0], cardIndex: split[1], slotIndex: split[2] }
            requestList.push(request);
        });
        this.postData(this.getUrl(this._liveValuesByGroupUrl, localStorage.getItem('username') || ''), requestList).subscribe()
    }

}