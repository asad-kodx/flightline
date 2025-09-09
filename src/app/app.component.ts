import { Component } from '@angular/core';
import {
  PageInterface,
  Site,
  Organization,
  DBKeys,
  User,
} from './shared/models/index';
import {
  AlertController,
  MenuController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { AuthService } from './core/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlarmDataProvider } from './core/providers/alarm-data.provider';
import { OrganizationDataProvider } from './core/providers/org-data.provider';
import { SiteContextService } from './core/services/site-context.service';
import { SiteDataProvider } from './core/providers/site-data.provider';
import {App} from '@capacitor/app'
import { OrgContextService } from './core/services/org-context.service';

import { ConfigurationService } from './core/services/configuration.service';

import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { SignalRService } from './core/services/signalr.service';
import { UserDataProvider } from './core/providers/user-data.provider';
import { PushMessageHandler } from './core/services/pushmessagehandler.service';
import { ControlDataProvider } from './core/providers/control-data.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  protected appPages: PageInterface[] = [
    { title: 'Dashboard', name: 'home', index: 1, icon: 'home' },
    { title: 'Controls', name: 'control-list', index: 2, icon: 'desktop' },
    { title: 'Alarms', name: 'alarm-list', index: 3, icon: 'notifications' },
    { title: 'Entities', name: 'rooms-page', index: 4, icon: 'speedometer' },
    {
      title: 'Offline Alerts',
      name: 'offline-alerts',
      index: 5,
      icon: 'alert',
    },
  ];
  tap = 0;
  currentUser?: string;
  sites?: Observable<Site[]>;
  private organizations?: Observable<Organization[]>;
  orgName: string | null = null;
  orgId: string | null = null;
  private pushInterval?: Subscription;
  pushEnabled = false;

  protected loggedInPages: PageInterface[] = [
    { title: 'Settings', name: 'user-settings-page', index: 3, icon: 'cog' },
    { title: 'Logout', name: 'home-page', icon: 'log-out', logsOut: true },
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
    private platform: Platform,
    private router: Router,
    private orgContext: OrgContextService

  ) {
    this.platform.ready().then(() => {
      this.initializePlatform();
    });
    
    this.setupBackButtonHandler();
  }
  
  private async initializePlatform() {
    try {
      // Initialize native platform features
      this.setupNativePlatform();
      
      // Handle authentication state
      this.handleInitialAuthentication();

      this.setupListeners();
      
      // Initialize app data and services
      this.initializeAppServices();
      
      // Setup authentication status monitoring
      this.setupAuthenticationMonitoring();
      
      // Initialize additional features
      this.initializeAdditionalFeatures();
      
    } catch (error) {
      console.error('Error during platform initialization:', error);
    }
  }
  
  private setupNativePlatform() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light });
      SplashScreen.hide();
    }
  }

  private setupListeners() {
    // Subscribe to organization changes
    this.orgContext.orgChanged$.subscribe(({id, name}) => {
      console.log('Organization changed:', {id, name});
      this.orgName = name;
      this.orgId = id.toString();
    });
  }
  
  private handleInitialAuthentication() {
    // Handle legacy auth-tokens format
    this.migrateLegacyTokens();
    
    // Check current authentication state
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.navigateToLogin();
    } else {
      this.navigateToHome();
    }
    
    // Load user data
    this.loadUserData();
  }
  
  private migrateLegacyTokens() {
    const bigToken = localStorage.getItem('auth-tokens');
    if (bigToken) {
      try {
        const parsedToken = JSON.parse(bigToken);
        console.log('Migrating legacy token format');
        this.authService.setAuthToken(parsedToken.access_token);
        localStorage.setItem('refresh_token', parsedToken.refresh_token);
        localStorage.removeItem('auth-tokens'); // Clean up legacy format
      } catch (error) {
        console.error('Error parsing legacy token:', error);
        localStorage.removeItem('auth-tokens'); // Remove corrupted token
      }
    }
  }
  
  private navigateToLogin() {
    this.menuCtrl.enable(false, 'loggedInMenu');
    this.navCtrl.navigateRoot('login');
  }
  
  private navigateToHome() {
    this.menuCtrl.enable(true, 'loggedInMenu');
    this.navCtrl.navigateRoot('home');
  }
  
  private loadUserData() {
    const username = localStorage.getItem('username');
    if (username) {
      this.currentUser = username.trim();
    }
    
    this.orgName = localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
    this.orgId = localStorage.getItem(DBKeys.SELECTED_ORG_ID);
  }
  
  private initializeAppServices() {
    this.startupAuth();
    this.sites = this.siteData.getSitesBinding();
    this.siteData.getSites();
    // this.signalRService.connect();
  }
  
  private setupAuthenticationMonitoring() {
    let startup = true;
    
    this.authService.loginStatus$.subscribe((status) => {
      this.handleAuthenticationStatusChange(status, startup);
      startup = false; // After first status change, no longer startup
    });
  }
  
  private handleAuthenticationStatusChange(status: boolean, isStartup: boolean) {
    if (!status && !isStartup) {
      this.handleUserLogout();
    } else if (status) {
      this.handleUserLogin(isStartup);
    }
  }
  
  private handleUserLogout() {
    console.log('User logged out - redirecting to login');
    this.menuCtrl.enable(false, 'loggedInMenu');
    this.navCtrl.navigateRoot('login');
    this.signalRService.disconnect();
  }
  
  private handleUserLogin(isStartup: boolean) {
    const username = localStorage.getItem('username');
    if (username) {
      this.currentUser = username.trim();
    }
    
    console.debug('User logged in - initializing services');
    
    this.authService.startRefreshTimer();
    this.menuCtrl.enable(true, 'loggedInMenu');
    this.getOrgs();
    
    // Load user info
    this.userData.getUserInfo().subscribe({
      next: (data: User) => {
        localStorage.setItem('user_info', JSON.stringify(data));
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
    
    // Connect SignalR if not during startup
    if (!isStartup) {
      this.signalRService.connect();
    }
  }
  
  private initializeAdditionalFeatures() {
    this.initPush();
    this.hookPlatformEvents();
    
    // Handle Enter key to hide keyboard
    document.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        Keyboard.hide();
      }
    });
  }
  
  private setupBackButtonHandler() {
    if (Capacitor.getPlatform() == 'android') {
      this.platform.backButton.subscribeWithPriority(10, () => {
      // Back button handling is managed by individual pages
      // This is a fallback handler with lower priority
      console.log('Back button pressed - handled by default behavior');
      this.exitAppOnAlert();
    });
    }
  
  }
  async exitAppOnDoubleTap(){
   if(this.router.url.includes('/home')){
      this.tap++;
      if(this.tap == 2){
        App.exitApp()
      }
      else {
        this.doubleTapExitToast();
      }
    }
    else{
      window.history.back();
    }
  }
  async exitAppOnAlert(){
      if(!this.router.url.includes('/home')){
        console.log('Pages left')
        window.history.back();
      }
      else{
        this.alertExit()
      }
  }
  async doubleTapExitToast(){
    console.log('Double Tap Exit Called!');
    let toast = await this.toastCtrl.create({
      message: 'Tap back button again to exit the App',
      duration: 3000,
      position: 'bottom',
      color: 'primary'
    })
    toast.present();
    const dismiss = await toast.onDidDismiss();
    if(dismiss){
      console.log('Dismiss',  dismiss);
      this.tap = 0
    }
  }
  async alertExit(){
    console.log('alert');
    const alert = await this.alertCtrl.create({
      header: 'Exit App',
      message: 'Are you sure you want to exit the App?',
      buttons: [
        {text: 'NO', role: 'cancel'},
        {text: 'YES', role: 'confirm', 
          handler: ()=>{
            App.exitApp();
          }
        }
      ]
    })
    alert.present();
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
    });
  }

  openPage(page: PageInterface) {
    this.navCtrl.navigateRoot(page.name);
    this.menuCtrl.close();
    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.authService.logout();
    }
    this.menuCtrl.close();
  }

  isActive(page: PageInterface) {
    return this.router.url.includes(page.name) ? 'primary' : 'white';
  }

  startupAuth() {
    this.authService.refreshToken().subscribe({
      error: (err) => {
        window.setTimeout(() => this.startupAuth(), 5000);
      },
    });
  }

  getOrgs() {
    this.organizations = this.orgData.getOrganizationsBinding();
    this.organizations?.subscribe((orgs: any[]) => {
      if (orgs && orgs.length > 0) {
        if (!localStorage.getItem(DBKeys.SELECTED_ORG_ID)) {
          localStorage.setItem(
            DBKeys.SELECTED_ORG_ID,
            orgs[0].organizationId.toString()
          );
          localStorage.setItem(DBKeys.SELECTED_ORG_NAME, orgs[0].name);
        }
        this.orgName = localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
        this.siteData.getSitesMap();
      }
    });
    this.orgData.getOrganizations();
  }

  changeOrg() {
    this.navCtrl.navigateRoot('user-settings');
    this.menuCtrl.close();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you wish to logout',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            this.navCtrl.navigateRoot('login-page');
            this.authService.logout();
            this.currentUser = '';
            localStorage.removeItem('username');
            // this.events.publish('logout');
            this.siteContext.clearSitesMap();
            this.orgName = null;
            this.orgId = null;
          },
        },
      ],
    });
    alert.present();
  }

  navToSiteAlarms(site: Site) {
    this.navCtrl.navigateRoot('site-alarms-list', { state: { site } })
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
    console.log("Is this Capacitor?", this.platform.is('capacitor'));
    if (!this.platform.is('capacitor')) return;
    this.platform.ready().then(() => {
      console.log("Initting push")
      // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      // OneSignal.initialize(ConfigurationService.oneSignalAppId);
      // if (this.currentUser) OneSignal.User.addTag("username", this.currentUser.trim())
      // else{
      //   console.log("User not found, resetting sub")
      //   OneSignal.User.removeTag("username");
      // }

      // OneSignal.Notifications.addEventListener('click', (data) => {
      //   console.log("Notification Clicked", data)
      //   OneSignal.Notifications.removeNotification(data.notification.androidNotificationId!)
      //   this.pushMessageHandler.processPushMessage(data.notification, true)
      //   this.alarmData.rehandleAlarmCountBadge()
      // });

      // OneSignal.Notifications.addEventListener('foregroundWillDisplay', (data) => {
      //   console.log("Foreground Notification Received", data)
      //   OneSignal.Notifications.removeNotification(data.getNotification().androidNotificationId!)
      //   this.pushMessageHandler.processPushMessage(data.getNotification())
      //   this.alarmData.rehandleAlarmCountBadge()
      // });
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

  public goToPushSettings() {
    // OneSignal.Notifications.promptForPushNotificationsWithUserResponse().then((accepted) => {
    //   // if (accepted) {
    //   //   this.pushEnabled = true;
    //   //   this.authService.saveUserPushTokenToServer();
    //   // }
    // });
    // OneSignal.Notifications.requestPermission();
  }
}
