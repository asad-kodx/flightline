import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../../shared/models/index";
import { OrgContextService } from "../services/org-context.service";
import { BaseDataProvider } from "./base-data.provider";
import { formatString } from 'typescript-string-operations';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserDataProvider extends BaseDataProvider<User> {

    private readonly _getUserUrl: string = "/api/users/{0}";
    private readonly _registerUrl: string = "/account/register";
    private readonly _pinUrl: string = "/account/generatepin";
    private readonly _addRolesToUserUrl = "/api/claim/{0}/addClaims";

    private get getUsersUrl(): string { return this.configurations.baseUrl + this._getUserUrl; }
    private get registerUrl(): string { return this.configurations.baseUrl + this._registerUrl; }
    private get pinUrl() { return this.configurations.baseUrl + this._pinUrl; }
    private get addRolesToUserUrl() { return this.configurations.baseUrl + this._addRolesToUserUrl; }

    constructor(http: HttpClient,  private orgContext: OrgContextService) {
        super(http, orgContext);
    }

    getUserInfo(): Observable<User> {
        var endpointUrl = formatString(this.getUsersUrl, localStorage.getItem('user_id'));
        return this.getData<User>(endpointUrl);
    }

    getRegisterEndpoint(user: User) {
        var endpointUrl = this.registerUrl;
        user.createdInDomain = window.location.origin;
        return this.postData(endpointUrl, user);
    }

    getPinEndpoint(): Observable<number> {
        var endpointUrl = this.pinUrl;
        return this.getData(endpointUrl);
    }

    addRolesToUserEndpoint(roles: Array<string>, userId: string): Observable<any> {
        var endpointUrl = formatString(this.addRolesToUserUrl, userId);
        return this.postData(endpointUrl, roles);
    }


}