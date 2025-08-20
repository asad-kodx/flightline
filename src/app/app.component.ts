import { Component } from '@angular/core';
import { PageInterface, Site, Organization, DBKeys, User } from './shared/models/index';
import { AlertController, MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlarmDataProvider } from './core/providers/alarm-data.provider';
import { OrganizationDataProvider  } from "./core/providers/org-data.provider";
import { SiteContextService } from './core/services/site-context.service';
import { SiteDataProvider } from './core/providers/site-data.provider';
import OneSignal from 'onesignal-cordova-plugin';

import { ConfigurationService } from "./core/services/configuration.service";

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { SignalRService } from './core/services/signalr.service';
import { UserDataProvider } from './core/providers/user-data.provider';
import { LogLevel } from 'onesignal-cordova-plugin';
import { PushMessageHandler } from './core/services/pushmessagehandler.service';
import { ControlDataProvider } from './core/providers/control-data.provider';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  protected appPages: PageInterface[] = [
    { title: 'Dashboard', name: 'home-page', index: 1, icon: 'home' },
    { title: 'Controls', name: 'control-list', index: 2, icon: 'desktop' },
    { title: 'Alarms', name: 'alarm-list', index: 3, icon: 'notifications' },
    { title: 'Entities', name: 'rooms-page', index: 4, icon: 'speedometer' },
    { title: 'Offline Alerts', name: 'offline-alerts', index: 5, icon: 'alert' }
  ];

  currentUser?: string;
  sites?: Observable<Site[]>;
  private organizations?: Observable<Organization[]>;
  orgName: string | null = null;
  orgId: string | null = null;
  private pushInterval?: Subscription;
  pushEnabled = false;

  protected loggedInPages: PageInterface[] = [
    { title: 'Settings', name: 'user-settings-page', index: 3, icon: 'cog' },
    { title: 'Logout', name: 'home-page', icon: 'log-out', logsOut: true }
  ];

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public alarmData: AlarmDataProvider,
    private siteData: SiteDataProvider,
    private userData: UserDataProvider,
    private orgData: OrganizationDataProvider,
    private controlData: ControlDataProvider,
    private siteContext: SiteContextService,
    private pushMessageHandler: PushMessageHandler,
    private authService: AuthService,
    private signalRService: SignalRService,
    private platform: Platform

  ) {

     this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.statusBar.show();
      if (Capacitor.isNativePlatform()) {
        StatusBar.setStyle({ style: Style.Light });
        SplashScreen.hide();
      }
      var bigToken = localStorage.getItem('auth-tokens');
      if (bigToken) {
        var parsedToken = JSON.parse(bigToken);
        console.log("Parsed Token", parsedToken);
        this.authService.setAuthToken(parsedToken.access_token)
        localStorage.setItem('refresh_token', parsedToken.refresh_token);
      }
      var token = localStorage.getItem('auth_token');
      if (!token) {
        this.menuCtrl.enable(false, 'loggedInMenu');
        this.navCtrl.navigateRoot('login');
      }
      else {
        this.menuCtrl.enable(true, 'loggedInMenu');
        this.navCtrl.navigateRoot('home');
      }
      // this.checkForUpdate();
      var startup = true;
      if(localStorage.getItem('username')) this.currentUser = localStorage.getItem('username')!.trim();
      this.orgName = localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
      this.orgId = localStorage.getItem(DBKeys.SELECTED_ORG_ID);
      this.startupAuth();
      this.sites = this.siteData.getSitesBinding();
      this.siteData.getSites();
      this.signalRService.connect();
      // this.events.subscribe("OrgChange", () => {
      //   this.orgName = localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
      //   this.orgId = localStorage.getItem(DBKeys.SELECTED_ORG_ID);
      // });
      // this.events.subscribe('logout', () => {
      //   this.nav.setRoot('login-page');
      // });
      this.authService.loginStatus$.subscribe((status) => {
        if (!status && !startup) {
          console.log('User is not logged in... ');
          // this.enableMenu(false);
          // this.nav.setRoot('login-page');
          this.menuCtrl.enable(false, 'loggedInMenu');
          this.navCtrl.navigateRoot('login');
          signalRService.disconnect();
        }
        else if (status) {
          this.currentUser = localStorage.getItem('username')!.trim();
          console.debug('User is logged in...');
          // this.events.publish('login');
          this.authService.startRefreshTimer();
          this.menuCtrl.enable(true, 'loggedInMenu');
          this.getOrgs();
          this.userData.getUserInfo().subscribe((data: User) => {
            localStorage.setItem("user_info", JSON.stringify(data));
          })

          if(!startup) signalRService.connect();
          startup = false;
        }
        else {
          startup = false;
        }
      });

      // this.events.subscribe("AlarmNav", (alarm => {
      //   this.handleAlarmPushNav(alarm);
      // }));

      // this.events.subscribe("AlertNav", (offlineAlert => {
      //   this.handleAlertPushNav(offlineAlert);
      // }));

      // this.events.subscribe("PopToRoot", () => {
      //   this.nav.pop();
      // })
      // this.initDeeplinks();
      this.initPush();
      this.hookPlatformEvents();
      // document.onkeypress = (e => {
      //   if (e.keyCode == 13) this.keyboard.hide();
      // });
      // if (this.platform.is('cordova')) this.screen.lock('portrait');
      //Handling for deeplinks
    });

    this.platform.backButton.subscribeWithPriority(2, () => {
      // const modal = this.app._appRoot._modalPortal.getActive();
      // const actionSheet = this.app._appRoot._overlayPortal.getActive()
      // const nav = this.app.getActiveNav();

      // if (actionSheet && actionSheet.dismiss()) {
      //   actionSheet.dismiss();
      // }
      // else if (modal && modal.dismiss()) {
      //   modal.dismiss();
      // }
      // else if (this.menu.isOpen()) {
      //   this.menu.close();
      // }
      // else if (nav.canGoBack()) {
      //   nav.pop();
      // }
      // else if (this.nav.canGoBack()) {
      //   this.nav.pop();
      // }
      // else {
      //   if (this.nav.getActive().id == 'login-page') return;
      //   this.nav.setRoot('home-page')
      // }

    });
  }

   private hookPlatformEvents() {
    this.platform.resume.subscribe(() => {
      this.authService.startRefreshTimer();
      this.alarmData.getMinimalAlarms();
      this.pushMessageHandler.startPushQueue();
      this.controlData.getControls().subscribe();
      this.alarmData.getAlarms().subscribe();
    });

    this.platform.pause.subscribe(() => {
      this.alarmData.rehandleAlarmCountBadge();
      this.pushMessageHandler.pausePushQueue();
      this.authService.stopRefreshTimer();
      this.alarmData.rehandleAlarmCountBadge();
    })
  }

  openPage(page: PageInterface) {
    this.navCtrl.navigateRoot(page.name);

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.authService.logout();
    }
  }

  isActive(page: PageInterface) {
    // let childNav = this.navCtrl.

    // // Main nav active
    // if (this.nav.getActive() && this.nav.getActive().id === page.name) {
    //   return 'primary';
    // }

    // //Tabs are a special case because they have their own navigation
    // if (childNav) {
    //   if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
    //     return 'primary';
    //   }
    //   return;
    // }

    // if (this.nav.getActive() && this.nav.getActive().name === page.name) {
    //   return 'primary';
    // }
    return 'primary';
  }


  startupAuth() {
    this.authService.refreshToken()
      .subscribe({
        error: (err) => {
          window.setTimeout(() => this.startupAuth(), 5000);
        }
      });
  }

  getOrgs() {
    this.organizations = this.orgData.getOrganizationsBinding();
    this.organizations?.subscribe((orgs: any[]) => {
      if (orgs && orgs.length > 0) {

        if (!localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
          localStorage.setItem(DBKeys.SELECTED_ORG_ID, orgs[0].organizationId.toString());
          localStorage.setItem(DBKeys.SELECTED_ORG_NAME, orgs[0].name);
        }
        this.orgName = localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
        this.siteData.getSitesMap();
      }
    });
    this.orgData.getOrganizations();
  }

  changeOrg() {
    this.navCtrl.navigateRoot('user-settings-page');
    this.menuCtrl.close();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you wish to logout',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.navCtrl.navigateRoot('login-page');
            this.authService.logout();
            this.currentUser = "";
            localStorage.removeItem("username")
            // this.events.publish('logout');
            this.siteContext.clearSitesMap();
            this.orgName = null;
            this.orgId = null;
          }
        }
      ]
    })
    alert.present();
  }

  navToSiteAlarms(site: Site) {
    this.navCtrl.navigateRoot('site-alarms-list', { state: site })
    this.menuCtrl.close();
  }

  public isAllSelected(sites: Site[]) {
    return this.siteContext.selectedSiteIds.length == sites.length;
  }

  public toggleSite(site: Site) {
    if (this.isSiteSelected(site)) this.siteContext.removeSiteId(site.siteId);
    else this.siteContext.addSiteId(site.siteId);
  }

  public isSiteSelected(site: Site) {
    return this.siteContext.isSiteSelected(site.siteId);
  }

   private initPush() {
    console.log("Is this Cordova?", this.platform.is('cordova'));
    if (!this.platform.is('cordova')) return;
    this.platform.ready().then(() => {
      console.log("Initting push")
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      OneSignal.initialize(ConfigurationService.oneSignalAppId);
      if (this.currentUser) OneSignal.User.addTag("username", this.currentUser.trim())
      else{
        console.log("User not found, resetting sub")
        OneSignal.User.removeTag("username");
      }

      OneSignal.Notifications.addEventListener('click', (data) => {
        console.log("Notification Clicked", data)
        OneSignal.Notifications.removeNotification(data.notification.androidNotificationId!)
        this.pushMessageHandler.processPushMessage(data.notification, true)
        this.alarmData.rehandleAlarmCountBadge()
      });

      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (data) => {
        console.log("Foreground Notification Received", data)
        OneSignal.Notifications.removeNotification(data.getNotification().androidNotificationId!)
        this.pushMessageHandler.processPushMessage(data.getNotification())
        this.alarmData.rehandleAlarmCountBadge()
      });
      // this.events.subscribe('login', () => {
      //   console.log("Login event detected, subbing")
      //     if(this.pushInterval) return;
      //     // OneSignal.deleteTag('username')
      //     // this.pushInterval = Observable.interval(5000).subscribe(() => {
      //     //   console.log("push interval running")
      //     //   OneSignal.getTags((data) => {
      //     //     console.log(data)
      //     //     // OneSignal.disablePush(false);
      //     //     OneSignal.setAppId(ConfigurationService.oneSignalAppId);
      //         if(this.currentUser) OneSignal.sendTag("username", this.currentUser.trim())
      //       })
             
          // })

      // });
      // this.events.subscribe('logout', () => {
      //   OneSignal.deleteTag("username");
      // });
    });
  }

  public goToPushSettings(){
    // OneSignal.Notifications.promptForPushNotificationsWithUserResponse().then((accepted) => {
    //   // if (accepted) {
    //   //   this.pushEnabled = true;
    //   //   this.authService.saveUserPushTokenToServer();
    //   // }
    // });
    OneSignal.Notifications.requestPermission();
  }
}
