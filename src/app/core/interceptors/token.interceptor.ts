import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, BehaviorSubject, catchError, throwError, switchMap, finalize, filter, take } from 'rxjs';
import { AlertController} from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private auth = this.injector.get(AuthService);
    constructor(public injector: Injector, private alerts: AlertController) {
    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.addToken(req, this.auth.getAuthToken())).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 400:
                        return this.handle400Error(error);
                        case 401:
                        return this.handle401Error(req, next);
                        case 500:
                        return this.handle500Error();
                        case 0:
                        return this.handle0Error();
                        default:
                        return throwError(() => error);
                    }
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    handle400Error(error: HttpErrorResponse){
        if (error && error.status === 400 && (error.error.error === 'invalid_request' || error.error.error === 'invalid_grant'))  {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            this.alerts.create({
                header: 'Invalid Login',
                message: error.error.error_description,
                buttons: ['Dismiss']
            }).then((alert: any) => {
                alert.present();
            })
            
            return this.logoutUser();
        }
        return throwError(() => new Error(error.message));
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next('');

            return this.auth.refreshToken()
                .pipe(
                    switchMap((newToken: any) => {
                        this.auth.loginStatus$.next(true);
                        if (newToken) {
                            this.tokenSubject.next(newToken.access_token);
                            console.log("Retrying command with new token", newToken.access_token)
                            return next.handle(this.addToken(req, newToken.access_token));
                        }

                        // If we don't get a new token, we are in trouble so logout.
                        return this.interceptorError("");
                    }),
                    catchError(error => {
                        // If there is an exception calling 'refreshToken', bad news so logout.
                        return this.interceptorError(error.message)
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    })
                )
        } else {
            return this.tokenSubject
                .pipe(
                    filter(token => token != null),
                    take(1),
                    switchMap(token => {
                    return next.handle(this.addToken(req, token));
                    })
                );
        }
    }

    handle500Error(){
        return throwError(() => 500);
    }

    handle0Error(){
        return throwError(() => 0);
    }


    logoutUser() {
        // Route to the login page (implementation up to you)
        // this.events.publish('logout');
        // var deviceId = localStorage.getItem("DeviceId");
        // this.auth.loginStatus$.next(false);
        localStorage.clear();
        // if(deviceId) localStorage.setItem("DeviceId", deviceId);
        return this.interceptorError("");
    }

    interceptorError(message: string): Observable<HttpEvent<any>> {
        return throwError(() => new Error(message));
    }
}