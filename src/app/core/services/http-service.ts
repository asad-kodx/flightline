import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private httpClient: HttpClient) {

    }

    get<T>(url: string, options?: any) {
        return this.httpClient.get<T>(url, options)
            .pipe(
                retry(2),
                catchError(this.handleError));

    }

    post<T>(url: string, body: any | undefined, options?: any) {
        return this.httpClient.post<T>(url, body, options)
            .pipe(
                retry(2),
                catchError(this.handleError));

    }

    put<T>(url: string, body: any | undefined, options?: any) {
        return this.httpClient.put<T>(url, body, options)
            .pipe(
                retry(2),
                catchError(this.handleError));
    }

    delete<T>(url: string, options?: any) {
        return this.httpClient.delete<T>(url, options)
            .pipe(
                retry(2),
                catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // a Client-side or network error occured. Handle it accordingly.
            console.error('An error occured:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }

        return throwError('There was an error processing the request.');

    }

}