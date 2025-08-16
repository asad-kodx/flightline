import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ConfigurationService } from "./configuration.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subscription, EMPTY, timer } from 'rxjs';
import { HttpService } from './http-service';
import { JwtHelper } from '../providers/jwt-helper.provider';
import { DBKeys, IdToken } from '../../shared/models/index';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly _baseUrl: string = ConfigurationService.baseUrl;
    private readonly _loginUrl: string = '/connect/token';
    public loginStatus$: BehaviorSubject<boolean>;
    public authToken$: BehaviorSubject<string | undefined>;
    public refreshToken$: BehaviorSubject<string | undefined>;
    private refreshTimer?: Subscription;
    private tokenExpireTime?: number;

    constructor(public http: HttpClient, private httpService: HttpService) {
        this.authToken$ = new BehaviorSubject<string | undefined>(undefined);
        this.refreshToken$ = new BehaviorSubject<string | undefined>(undefined);
        this.loginStatus$ = new BehaviorSubject<boolean>(false);
    }

    private get loginUrl() { return this._baseUrl + this._loginUrl; }

    getAuthToken() {
        return localStorage.getItem('auth_token') || '';
    }

    setAuthToken(authToken: string) {
        localStorage.setItem('auth_token', authToken);
        this.authToken$.next(authToken);
        this.loginStatus$.next(true);
        this.removeUserPushTokenFromService();
    }

    setRefreshToken(refreshToken: string) {
        this.refreshToken$.next(refreshToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    setRoles(roles: string){
        localStorage.setItem(DBKeys.ROLES, roles)
    }

    refreshToken() {
        this.stopRefreshTimer();
        var token = localStorage.getItem('refresh_token');
        if (!token) return EMPTY;
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const params = new HttpParams()
            .append('refresh_token', token)
            .append('grant_type', 'refresh_token');

        const requestBody = params.toString();

        return this.http.post(this.loginUrl, requestBody, { headers: header })
            .pipe(tap((response: any) => {
                if (response) {
                    const jwtHelper = new JwtHelper();
                    const decodedIdToken = <IdToken>jwtHelper.decodeToken(response.id_token);
                    this.tokenExpireTime = decodedIdToken.iat * 1000 + 3.6e+6;
                    localStorage.setItem(DBKeys.USER_ID, decodedIdToken.sub);
                    localStorage.setItem(DBKeys.TOKEN_EXPIRE_TIME, this.tokenExpireTime.toString());
                    this.setAuthToken(response.access_token);
                    this.setRoles(decodedIdToken.role)
                }

            }));
    }

    login(username: string, password: string) {
        localStorage.setItem('username', username.trim());
        const header = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const params = new HttpParams()
            .append('username', username)
            .append('password', password)
        .append('grant_type', 'password')
            .append('scope', 'openid email phone profile offline_access roles')
            .append('resources', window.location.origin);

        console.debug('Login Params', params);

        const requestBody = params.toString();
        return this.http.post(this.loginUrl, requestBody, { headers: header }).pipe(
            tap(response => console.debug('Login Token Response', response)),
            tap((response: any) => {
                if (response) {
                    const jwtHelper = new JwtHelper();
                    const decodedIdToken = <IdToken>jwtHelper.decodeToken(response.id_token);
                    localStorage.setItem(DBKeys.USER_ID, decodedIdToken.sub);
                    this.tokenExpireTime = decodedIdToken.iat * 1000 + 3.6e+6;
                    localStorage.setItem(DBKeys.TOKEN_EXPIRE_TIME, this.tokenExpireTime.toString());
                    this.setAuthToken(response.access_token);
                    this.setRefreshToken(response.refresh_token);
                    this.setRoles(decodedIdToken.role);
                }

            })
        );
    }


    saveUserPushTokenToServer() {
        console.log('Push Enabled, writing token to server');
        var username = localStorage.getItem('username')
        var deviceId = localStorage.getItem('DeviceId')
        if (username && deviceId) this.httpService.delete(ConfigurationService.deviceTokenUrl + `/${username}/${deviceId}`).subscribe();


    }

    removeUserPushTokenFromService() {
        var username = localStorage.getItem('username');
        var deviceId = localStorage.getItem('DeviceId');
        if (username && deviceId) this.httpService.delete(ConfigurationService.deviceTokenUrl + `/${username}/${deviceId}`).subscribe();
    }

    startRefreshTimer() {
        if (this.refreshTimer) return;
        this.refreshTimer = timer(0, 30000).subscribe(() => {
            this.tokenExpireTime = Number(localStorage.getItem(DBKeys.TOKEN_EXPIRE_TIME))
            if (moment(new Date(this.tokenExpireTime)).diff(moment(), "minutes") < 15) {
                this.refreshToken().subscribe();
            }
        });
    }

    stopRefreshTimer() {
        if (this.refreshTimer) this.refreshTimer.unsubscribe();
        this.refreshTimer = undefined;
    }

    logout() {
        this.stopRefreshTimer();
        var deviceId = localStorage.getItem('DeviceId');
        this.removeUserPushTokenFromService();
        localStorage.clear();
        if (deviceId) localStorage.setItem('DeviceId', deviceId);
        this.loginStatus$.next(false);
    }

}