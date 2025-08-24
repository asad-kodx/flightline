import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ConfigurationService } from '../services/configuration.service';
import { OrgContextService } from '../services/org-context.service';

export class BaseDataProvider<T> {

    protected orgId?: number;
    protected configurations = ConfigurationService;

    public data!: Observable<T>;
    public _data$!: BehaviorSubject<T>;
    protected dataStore!: {
        values: T;
    }

    constructor(protected http: HttpClient, orgContext: OrgContextService) {

        orgContext.OrganizationChanged.subscribe((orgIdEmit) => {
            this.orgId = orgIdEmit;
        });
    }

    public getData<T>(url: string): Observable<T> {
        return this.http.get<T>(url).pipe(catchError(this.handleError))
    }

    public getDataUncaught<T>(url: string): Observable<T> {
        return this.http.get<T>(url)
    }

    public postData<T>(url: string, postBody: any): Observable<T> {
        return this.http.post<T>(url, postBody).pipe(catchError(this.handleError));
    }

    public deleteData<T>(url: string) : Observable<T> {
        return this.http.delete<T>(url).pipe(catchError(this.handleError));
    }

    public getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } | null {
        return null;
    }


    protected handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const err = error || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return throwError(error);
    }
}