import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AndroidAnimation, AndroidViewStyle, InAppBrowser, iOSAnimation, iOSViewStyle } from '@capacitor/inappbrowser';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { catchError, Observable, of, Subscription, timeout } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { SiteContextService } from 'src/app/core/services/site-context.service';
import { Control, SoftwareType } from '../../models';
import * as moment from 'moment';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

@Component({
  selector: 'control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
  standalone: false,
})
export class ControlComponent  implements OnInit {
  @Input() control: any;
  @Input() searchText: any;
  @Output() controlClicked = new EventEmitter();
  @Output() toggleFavoriteClicked = new EventEmitter();

  text!: string;
  protected liveValuesMap!: Observable<Map<string, any>>;
  private sub!: Subscription;

  constructor(
    public alarmData: AlarmDataProvider,
    private siteContext: SiteContextService,
    private auth: AuthService,
    private controlData: ControlDataProvider,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}


  itemTapped() {
    this.controlClicked.emit();
    // console.log("Control Clicked")
  }

  favoriteClicked() {
    this.toggleFavoriteClicked.emit();
    // console.log("Favorite Clicked")
  }

  shouldShow(control: Control) {
    if (!this.siteContext.isSiteSelected(control.siteId)) return false;
    if (!this.searchText || this.searchText.trim() == "") return true;
    if (control.name == null || control.name == undefined) control.name = "";
    return (control.name.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      control.serialNumber!.toString().indexOf(this.searchText.toLocaleLowerCase()) > -1);
  }

  isOnline(control: Control) {
    if (moment().diff(moment(control.lastHttpPing), 'minutes') > 5) {
      if (moment().diff(moment(control.lastMqttPing), 'minutes') > 5) {
        return 'offline';
      }
      return 'offline'
    }
    return 'online';
  }

  startRemoteAccess(control: Control) {
    if(this.isOnline(this.control) == 'offline') {
      this.toastCtrl.create({
        message: "Can't open connection as control is marked offline",
        position: 'middle',
        duration: 5000
      }).then(toast => toast.present());
      return;
     }
    if(control.softwareType == SoftwareType.FUSION || control.softwareType == SoftwareType.UNKNOWN) {
      this.startVNC();
    }
    else if(control.softwareType == SoftwareType.FUSION_LIGHT) {
      this.startWebRemoteControlFusionLight(control.serialNumber!)
    }
  }

  async startWebRemoteControlFusionLight(serialNumber: number) {
  
    console.log(this.platform.is('capacitor'))
    const url =  `${ConfigurationService.fusionLightWebUrl}?serialNo=${this.control.serialNumber}&authToken=${this.auth.getAuthToken()}`
    if(this.platform.is('capacitor')) {
      await InAppBrowser.openInSystemBrowser({ 
        url,
        options: {
          android: {
            showTitle: false,
            hideToolbarOnScroll: false,
            viewStyle: AndroidViewStyle.FULL_SCREEN,
            startAnimation: AndroidAnimation.SLIDE_IN_LEFT,
            exitAnimation: AndroidAnimation.SLIDE_OUT_RIGHT
          },
          iOS: {
            closeButtonText: 'Close' as any,
            viewStyle: iOSViewStyle.FULL_SCREEN,
            animationEffect: iOSAnimation.COVER_VERTICAL,
            enableBarsCollapsing: false,
            enableReadersMode: false
          }
        }
      });
    }
    else window.open(url);
  }



  startVNC() {
     if(this.isOnline(this.control) == 'offline') {
      this.toastCtrl.create({
        message: "Can't open connection as control is marked offline",
        position: 'middle',
        duration: 5000
      }).then(toast => toast.present());
      return;
     }
     if(this.platform.is('capacitor')){
      let loading: any = null;
      this.loadingCtrl.create(
        {message: 'Starting Remote VNC connection'}
        ).then(loader => {
         loading = loader;
         loader.present()}
        );
        this.controlData.startVnc(this.control.controlId)
        .pipe(
          timeout(10000),
          catchError((err) => {
            loading?.dismiss();
            return of(null);
          })
        )
        // .timeout(10000)
        // .catch((err) => loader.dismiss())
        .subscribe(async (port: any) => {
          var connectionUrl = `http://flightline-control.com/assets/novnc/vnc.html?host=controltechssh.flightline-control.com&port=7000&password=ou812vncfusionconnect&path=%2Fwebsockify%3Ftoken%3D${port.tokenPort}&autoconnect=1&resize=none`;
          setTimeout(async () => {
            //console.log("replacing with conneciton url")
            loading?.dismiss();
            await InAppBrowser.openInWebView({ 
              url: connectionUrl,
              options: {
                showURL: false,
                showToolbar: false,
                clearCache: false,
                clearSessionCache: false,
                mediaPlaybackRequiresUserAction: false,
                closeButtonText: 'Close' as any,
                toolbarPosition: 'top' as any,
                showNavigationButtons: false,
                leftToRight: false,
                android: {
                  allowZoom: false,
                  hardwareBack: true,
                  pauseMedia: false
                },
                iOS: {
                  viewStyle: iOSViewStyle.FULL_SCREEN,
                  animationEffect: iOSAnimation.COVER_VERTICAL,
                  allowsBackForwardNavigationGestures: false,
                  allowOverScroll: false,
                  enableViewportScale: false,
                  allowInLineMediaPlayback: false,
                  surpressIncrementalRendering: false,
                }
              }
            });
          }, 4000);
        });
    }
    else {
      const newWindow = window.open("/", '_blank', 'width=1070,height=830,toolbar=0,menubar=0;location=0');
    
      var url = `http://flightline-control.com/assets/novnc/vnc.html?connecting=true`;
      newWindow?.location.replace(url);
      setTimeout(() => {
        //console.log("replacing with middleman url")
        var url = `http://flightline-control.com/assets/novnc/vnc.html?connecting=true`;
        newWindow?.location.replace(url);
        this.controlData.startVnc(this.control.controlId).subscribe((port: any) => {
          var connectionUrl = `http://flightline-control.com/assets/novnc/vnc.html?host=controltechssh.flightline-control.com&port=7000&password=ou812vncfusionconnect&path=%2Fwebsockify%3Ftoken%3D${port.tokenPort}&autoconnect=1&resize=scale`;
          setTimeout(() => {
            //console.log("replacing with conneciton url")
            newWindow?.location.replace(connectionUrl);
          }, 4000);
        });
      }, 500)
    }
  }

  shouldShowBadge(control: Control) {
    var ac = this.alarmData.getAlarmCounts(control.serialNumber, undefined, undefined);
    if (ac.acknowledgedCount + ac.activeCount == 0) return false;
    return true;
  }

  shouldShowSilentBadge(control: Control) {
    var ac = this.alarmData.getAlarmCounts(control.serialNumber, undefined, undefined);
    if (ac.silentCount == 0) return false;
    return true;
  }

  getLVColor(value: any) {
    if (value) return 'white';
    return 'orange'
  }

}
