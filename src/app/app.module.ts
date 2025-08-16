import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { OneSignal } from "@awesome-cordova-plugins/onesignal/ngx";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Badge } from '@awesome-cordova-plugins/badge/ngx';
import { SharedModule } from './shared/shared.module';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SharedModule],
  providers: [
    InAppBrowser,
    OneSignal,
    Network,
    Badge,
    StatusBar,
    SplashScreen,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
