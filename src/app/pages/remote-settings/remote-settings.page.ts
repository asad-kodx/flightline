import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { RemoteSettingsService } from '../../core/services/remote-settings-service';
// import { RemoteSettings, Settings, SettingItem } from '../../models/remote-setting-model';
// import { Option } from '../../models/remote-setting-model';
import { ControlDataProvider } from '../../core/providers/control-data.provider';
// import { RemoteSettingsInputType } from '../../models/types/remote-setting-input-type';
// import { isNullOrUndefined, isNumber } from 'util';
// import { RemoteHeader } from '../../models/remote-header-model';
// import { Setting } from '../../models/remote-setting-update-model';
// import { RemoteSettingUpdateAcknowledgement } from '../../models/remote-setting-update-acknowledge-model';
// import { StatusCode } from '../../models/types/status-code';
// import { RemoteSettingCommandType } from '../../models/types/remote-settings-command-type';
// import { EntityType } from '../../models/types/entity-type';
import { AlarmDataProvider } from '../../core/providers/alarm-data.provider';
// import { ControlAlarm } from '../../models/control-alarm-model';
// import { AlarmState } from '../../models/types/alarm-state';
// import { Observable, Subscription } from 'rxjs';
// import { LiveValueData } from '../../models/live-valiue-data.model';
import { ConfigurationService } from '../../core/services/configuration.service';
// import { Keyboard } from '@ionic-native/keyboard';

// Import models and types
import {
  RemoteSettings,
  RemoteSettingUpdateAcknowledgement,
  RemoteHeader,
  ControlAlarm,
  SettingItem,
  Setting,
  Option,
  Settings,
  AlarmState,
  EntityType,
  RemoteSettingCommandType,
  RemoteSettingsInputType,
  LiveValueData,
  StatusCode
} from '../../shared/models/index';
import { isNumber } from 'lodash';

@Component({
  selector: 'app-remote-settings',
  templateUrl: './remote-settings.page.html',
  styleUrls: ['./remote-settings.page.scss'],
  standalone: false,
})
export class RemoteSettingsPage implements OnInit, OnDestroy {
  //User-defined datatype variables declaration
  private pageLoadTimeout: number = 30000; //page load timeout set to 30 seconds
  public remoteSettings: RemoteSettings | null = null;
  private preprocessedRemoteSettings: RemoteSettings | null = null;
  private settingUpdateAcknowledgement: RemoteSettingUpdateAcknowledgement | null = null;
  private remoteSettingHeader: RemoteHeader;
  public alarms: Observable<ControlAlarm[]> | null = null;


  //Any datatype variables declaration
  private remoteSettingChanges: any = null;
  public remoteSettingsInputType: any = null;
  private pageLoader: any = null;
  public entityData: any = null;
  private applySettingsTimer: any = null;
  public pullMax = window.innerHeight * .7
  public pullMin = window.innerHeight * .12

  //String datatype variables declaration
  public statusMessage: string = '';
  private backupRemoteSettings: string = '';
  public pageLoadErrorMessage: string = '';
  public pageLoadErrorTitle: string = '';
  private getActiveRequestId: string = '';
  private applyActiveRequestId: string = '';
  public expandCollapseBtnTxt: string = '';
  public settingsType: string = '';

  //Number datatype variables declaration
  private oldValue: string = '';
  private changedSettings: Array<number> = [];

  //Boolean datatype variables declaration
  public loadHasErrors: boolean = false;
  public hideApplyResetButtons: boolean = false;
  public showErrorInfoTemplate: boolean = false;
  private isPageRefreshRequested: boolean = false;
  private isPageLoading: boolean = false;
  private isValueChanged: boolean = false;
  private isManualFireClicked: boolean = false;
  private isPageRefreshAfterApply: boolean = false;
  public btnApplyDisabled: boolean = false;
  private activeRequest: boolean = false;
  public isEmptySettingReceived: boolean = false;
  private isAllSettingsExpanded: boolean = false;
  public isKeyboardOpen: boolean = false;
  private keyboardOpenSub: Subscription | null = null;
  private keyboardClosedSub: Subscription | null = null;

  //arrow key icon for setting expand/collapse
  private expandCollapseIcon: string = "arrow-down";
  private toggleClassName: string = "settings-card-content-min";

  /**
   * Creates a new instance of this page
   */
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private toastController: ToastController,
    private loadingController: LoadingController
    // TODO: Add these services when they become available:
    // public renderer: Renderer2,
    // private events: Events,
    // public navParams: NavParams,
    // private controlData: ControlDataProvider,
    // private keyboard: Keyboard,
    // public remoteSettingsService: RemoteSettingsService,
    // private alarmData: AlarmDataProvider
  ) {
    this.remoteSettingHeader = {} as RemoteHeader; // Initialize as empty object for now
    this.entityData = {}; // Mock data for now
    console.log(this.entityData)
    this.btnApplyDisabled = true;
    this.pageLoadErrorMessage = '';
    this.pageLoadErrorTitle = '';
    this.loadHasErrors = false;
    this.showErrorInfoTemplate = false;
    this.hideApplyResetButtons = true;
    this.isPageRefreshRequested = false;
    this.isPageLoading = false;
    this.isValueChanged = false;
    this.isPageRefreshAfterApply = false;
    this.activeRequest = false;
    this.isEmptySettingReceived = false;
    this.expandCollapseBtnTxt = "Expand all";
    this.isAllSettingsExpanded = false;
    this.isManualFireClicked = false;
    this.changedSettings = [];
    this.applySettingsTimer = null;
  }

  ngOnInit() {
    // Initialize component
    console.log('RemoteSettingsPage initialized');
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.keyboardOpenSub) {
      this.keyboardOpenSub.unsubscribe();
    }
    if (this.keyboardClosedSub) {
      this.keyboardClosedSub.unsubscribe();
    }
  }

  customPopoverOptions: any = {
    title: 'Value',
    enableBackdropDismiss: false,
    cssClass: 'ion-drop-down-menu'
  };


  //#region Page Lifecycle events

  /**
   * Fired only when a view is stored in memory. This event is NOT fired on entering a view that is already cached
   */
  ionViewDidLoad() {
    //console.log("did load");
  }

  /**
   * Fired when entering a page, after it becomes the active page
   */
  ionViewDidEnter() {
    //console.log("Did enter");
  }

  /**
   * Fired when a view is going to be completely removed (after leaving a non-cached view)
   */
  ionViewWillUnload() {
    //console.log("will unload");
  }

  /**
   * Fired when you leave a page, after it stops being the active one
   */
  ionViewDidLeave() {
    //console.log("did leave")    
    // this.navCtrl.pop();
  }

  /**
   * Fired when you leave a page, before it stops being the active one
   */
  ionViewWillLeave() {
    //console.log("will leave")
    // TODO: Uncomment when services are available
    // this.events.unsubscribe('receiveRemoteSettings');
    // this.events.unsubscribe('receivedRemoteSettingsAcknowledgement');
    // this.events.unsubscribe('receiveRequestSettingsAcknowledgement');
    // this.events.unsubscribe('receiveApplySettingsAcknowledgement');
    // this.events.unsubscribe('AlarmControlTabs');
    // this.remoteSettingsService.activeApplyRequests.clear();
    // this.remoteSettingsService.activeGetRequests.clear();
    if (this.keyboardOpenSub) {
      this.keyboardOpenSub.unsubscribe();
    }
    if (this.keyboardClosedSub) {
      this.keyboardClosedSub.unsubscribe();
    }
    // this.events.unsubscribe('AlarmSwitch');
  }


  /**
   *  Fired when entering a page, before it becomes the active one
   */
  ionViewWillEnter() {
    this.remoteSettingsInputType = RemoteSettingsInputType;
    this.processReceivedRemoteSettings();
    this.processSettingsUpdateAcknowledgement();
    this.showPageLoader();
    this.getRemoteSettings();

    // TODO: Uncomment when services are available
    // this.alarms = this.alarmData.getAllAlarmsBinding();
    // this.events.subscribe('AlarmSwitch', () => {
    //   this.navCtrl.navigateBack('/');
    // });
    // this.events.subscribe('AlarmControlTabs', (alarm: any) => {
    //   this.navCtrl.navigateForward('/alarm-details-tabs', { state: { alarm: alarm, nav: this.navCtrl } });
    // });

    // TODO: Implement keyboard handling when Keyboard plugin is available
    // this.keyboardOpenSub = this.keyboard.onKeyboardWillShow().subscribe(() => {
    //   this.isKeyboardOpen = true;
    //   console.log("Setting keyboard open to true", this.isKeyboardOpen)
    // });
    // this.keyboardClosedSub = this.keyboard.onKeyboardWillHide().subscribe(() => {
    //   console.log("Setting keyboard open to false")
    //   this.isKeyboardOpen = false;
    // })
  }
  //#endregion

  /**
   * 
   * Handles the refresh event when user refreshes the page
   * @param event 
   */
  handleRefresh(event: any) {
    //reset the already rendered page
    this.remoteSettings = null;
    this.isPageRefreshRequested = true;
    //reset error flags and templates
    this.isEmptySettingReceived = false;
    this.loadHasErrors = false;
    this.showErrorInfoTemplate = false;
    this.hideApplyResetButtons = true;
    this.btnApplyDisabled = true;
    this.isPageRefreshAfterApply = false;
    this.isAllSettingsExpanded = false;
    this.expandCollapseBtnTxt = "Expand all";
    //send a request for getting remote settings
    this.getRemoteSettings();
    this.showPageLoader();

    //#region Timer code for possible future use - DONOT Delete
    // this.sub = Observable.interval(this.pageLoadTimeout).subscribe((val) => {
    //   if(isNullOrUndefined(this.remoteSettings)) {
    //     this.displayRequestTimeout();
    //   }
    //   this.sub.unsubscribe();
    // })
    // var source = timer(0, 1000);

    // this.sub = source.subscribe(val => {
    //   //console.log(val, '-');
    //   var diff = (this.pageLoadTimeout/1000) - val;
    //   if(this.sub == 30) {
    //     this.sub.unsubscribe();
    //     this.displayRequestTimeout();
    //   }
    //   this.sub.unsubscribe();
    // });
    //#endregion

    window.setTimeout(() => event.complete(), 500);
  }

  /**
   * Checks and returns true if the relevant alarm is active and not silent
   * @param alarms List of triggered alarms
   * @param setting Current setting
   */
  alarmIsActive(alarms: ControlAlarm[], setting: SettingItem): boolean {
    const alarm = alarms.find(a => a.hardwareId == this.entityData.entityNumber && a.type == setting.secondarySettingId && a.state == AlarmState.Active && a.roomProgramId == this.entityData.roomId);
    if (alarm != null) {
      if (!alarm.silent) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

  /**
   * Checks and returns true if the relevant alarm is acknowledged
   * @param alarms List of triggered alarms
   * @param setting Current setting
   */
  alarmIsAcked(alarms: ControlAlarm[], setting: SettingItem) {
    return alarms.find(a => a.hardwareId == this.entityData.entityNumber && a.type == setting.secondarySettingId && a.state == AlarmState.Acknowledged && a.roomProgramId == this.entityData.roomId) != null
  }

  /**
   * Checks and returns true if the relevant alarm is active and silent
   * @param alarms List of triggered alarms
   * @param setting Current setting
   */
  alarmIsSilent(alarms: ControlAlarm[], setting: SettingItem): boolean {
    const alarm = alarms.find(a => a.hardwareId == this.entityData.entityNumber && a.type == setting.secondarySettingId && a.state == AlarmState.Active);
    if (alarm != null) {
      if (alarm.silent == true) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

  /**
   * This event is fired when manual fire button is clicked
   * @param setting setting inside which manual fire button is clicked
   */
  manualFire(setting: any) {
    this.changedSettings.push(setting.secondarySettingId);
    this.isManualFireClicked = true;
    this.constructRemoteSettingHeader();
    // TODO: Implement when service is available
    // this.remoteSettingsService.postUpdatedRemoteSettings(this.remoteSettingHeader, this.constructManualFireApply(setting), this.entityData.remoteSettingType, this.entityData.entityType);
    console.log('Manual fire triggered for setting:', setting);
  }

  /**
   * Constructs the manual fire apply request
   * @param currentSetting setting inside which manual fire button is clicked
   */
  constructManualFireApply(currentSetting: SettingItem): Setting[] {
    var updatedSettingsList: Setting[] = [];
    var manualFireOption: Setting = {} as Setting;
    manualFireOption.settingId = currentSetting.settingId;
    manualFireOption.moduleId = currentSetting.moduleId;
    manualFireOption.secondarySettingId = currentSetting.secondarySettingId;

    // TODO: Implement when ConfigurationService is available
    const manualFireOption_option = currentSetting.options?.find(op => op.label.trim().toUpperCase() == 'MANUAL FIRE');
    if (manualFireOption_option) {
      manualFireOption.id = manualFireOption_option.id;
    }

    updatedSettingsList.push(manualFireOption);
    return updatedSettingsList;
  }

  /**
   * Acknowledges the relevant alarm
   * @param setting Current setting
   */
  ackAlarm(setting: SettingItem) {
    // TODO: Implement when alarmData service is available
    // var alarm = this.alarmData.getAlarmBySetting(this.entityData.entityNumber, setting.secondarySettingId);
    // this.alarmData.acknowledgeAlarm(alarm).subscribe();
    console.log('Acknowledging alarm for setting:', setting);
  }

  /**
   * Resolves the relevant alarm
   * @param setting Current setting
   */
  resolveAlarm(setting: SettingItem) {
    // TODO: Implement when alarmData service is available
    // var alarm = this.alarmData.getAlarmBySetting(this.entityData.entityNumber, setting.secondarySettingId);
    // this.alarmData.resolveAlarm(alarm).subscribe();
    console.log('Resolving alarm for setting:', setting);
  }


  /**
   * Shows the page loader when getting settings
   */
  showPageLoader() {
    this.statusMessage = "Requesting control settings...";
    this.pageLoader = this.loadingController.create({
      spinner: "crescent",
      message: this.statusMessage,
      showBackdrop: true,
      backdropDismiss: true
    });
    setTimeout(() => {
      this.pageLoader.dismiss();
      this.isPageLoading = false;
      this.displayRequestTimeout();

    }, this.pageLoadTimeout)

    //#region Alternate Pageloader dismiss logic
    // this.pageLoader.onDidDismiss(() => {
    //     //this.pageLoader.present().then(() => {
    //       if(isNullOrUndefined(this.remoteSettings)) {
    //         //this.pageLoader.dismiss();
    //         this.isPageLoading = false;
    //         this.displayRequestTimeout();
    //       }
    //     //})
    // });
    //#endregion

    this.isPageLoading = true;
    this.pageLoader.present();
  }

  /**
   * Toggles the expand/collapse of loaded entity/alarm settings
   * @param currentSetting Setting being processed currently
   */
  toggleExpandCollapseSettings(currentSetting: SettingItem) {
    //console.log("toggleExpandCollapseSettings");
    if (currentSetting.isSettingExpanded) {
      currentSetting.cssClass = "settings-card-content-min"
    }
    else {
      currentSetting.cssClass = "settings-card-content-max"
    }
    currentSetting.isSettingExpanded = !currentSetting.isSettingExpanded;
    currentSetting.expandCollapseIcon = currentSetting.expandCollapseIcon == "arrow-down" ? "arrow-up" : "arrow-down"
  }

  /**
   * Displays the request timeout card if control didn't respond with settings
   */
  displayRequestTimeout() {
    if (!this.loadHasErrors && !this.isEmptySettingReceived && (this.remoteSettings == null || this.remoteSettings == undefined)) {
      this.loadHasErrors = false;
      this.showErrorInfoTemplate = true;
      this.hideApplyResetButtons = true;
      this.pageLoadErrorTitle = "Info";
      this.pageLoadErrorMessage = "Request timed out, no response from control";
    }
  }

  /**
   * Shows the page loader when applying settings
   */
  showApplySettingsToast() {
    this.statusMessage = "Applying changed settings to the control..";
    this.pageLoader = this.loadingController.create({
      spinner: "crescent",
      message: this.statusMessage,
      showBackdrop: true,
      backdropDismiss: true,
      duration: this.pageLoadTimeout
    });
    this.applySettingsTimer = setTimeout(() => {
      this.pageLoader.dismiss();
      this.isPageLoading = false;
      this.showToast("Applying settings failed. Please check network connection", 10000, true);
    }, this.pageLoadTimeout)
    this.isPageLoading = true;
    this.pageLoader.present();
  }

  /**
   * Makes a call to the server to send get settings request to fusion
   */
  getRemoteSettings() {
    this.getSettingsType();
    this.constructRemoteSettingHeader();
    // TODO: Implement when remoteSettingsService is available
    // this.remoteSettingsService.requestRemoteSettings(this.remoteSettingHeader, this.entityData.remoteSettingType, this.entityData.entityType);
    console.log('Getting remote settings for:', this.entityData);
  }

  /**
   * Makes a call to the server to send the apply settings message
   */
  applySettings() {
    this.showApplySettingsToast();
    this.constructRemoteSettingHeader();
    // TODO: Implement when remoteSettingsService is available
    // this.remoteSettingsService.postUpdatedRemoteSettings(this.remoteSettingHeader, this.constructUpdatedRemoteSettings(), this.entityData.remoteSettingType, this.entityData.entityType);
    console.log('Applying settings:', this.constructUpdatedRemoteSettings());
  }

  /**
   * Get the settings type requested from devices/sensors list page
   */
  getSettingsType() {
    if (this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
      if (this.entityData.entityType == EntityType.Room) {
        this.settingsType = "settings";
      }
      else if (this.entityData.entityType == EntityType.Device) {
        this.settingsType = "device settings";
      }
      else if (this.entityData.entityType == EntityType.Sensor) {
        this.settingsType = "sensor settings";
      }
    }
    else if (this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
      this.settingsType = "alarm settings";
    }
  }

  /**
   * Constructs the header for get/apply remote settings requests
   */
  constructRemoteSettingHeader() {
    //console.log("Entity Data", this.entityData);
    if (this.entityData != null && this.entityData != undefined) {
      this.remoteSettingHeader.serialNumber = this.entityData.controlSerialNumber;
      this.remoteSettingHeader.entityId = this.entityData.entityNumber;
      if (this.entityData.entityType == EntityType.Device || this.entityData.entityType == EntityType.Sensor) {
        this.remoteSettingHeader.roomId = this.entityData.roomId;
      }
      else {
        this.remoteSettingHeader.roomId = this.entityData.entityNumber;
      }

    }

    this.remoteSettingHeader.connectionId = '';
    this.remoteSettingHeader.pin = '';
    this.remoteSettingHeader.requestId = '';
    this.remoteSettingHeader.timeStamp = '';
    this.remoteSettingHeader.userId = '';
  }

  /**
   * Constructs the apply settings request based on the settings changed by user on the page
   */
  constructUpdatedRemoteSettings(): Setting[] {
    var settingChanges = this.remoteSettingChanges;
    //console.log("Remote setting changes", this.remoteSettingChanges);
    var updatedSettingsList: Setting[] = [];
    var updatedSetting: Setting | null;
    var remoteSettingsTemp = this.remoteSettings;
    if (settingChanges != null) {
      settingChanges.forEach((difference: any) => {
        //filtering any changes on enabled property because it doesn't come from the control
        if (difference.path[5] != 'enabled' && difference.path[5] != 'borderColor' && difference.path[3] != 'cssClass' && difference.path[3] != 'expandCollapseIcon' && difference.path[3] != 'isSettingExpanded') {
          switch (this.entityData.remoteSettingType) {
            case RemoteSettingCommandType.EntitySettings: {
              updatedSetting = this.getChangedSettings(remoteSettingsTemp!.settings.entitySettings, JSON.parse(this.backupRemoteSettings).settings.entitySettings, difference);
              if (updatedSetting) {
                updatedSettingsList.push(updatedSetting);
                if (this.changedSettings.indexOf(updatedSetting.settingId) == -1) {
                  this.changedSettings.push(updatedSetting.settingId);
                }
              }
              break;
            }
            case RemoteSettingCommandType.AlarmSettings: {
              updatedSetting = this.getChangedSettings(remoteSettingsTemp!.settings.alarmSettings, JSON.parse(this.backupRemoteSettings).settings.alarmSettings, difference);
              if (updatedSetting) {
                updatedSettingsList.push(updatedSetting);
                if (this.changedSettings.indexOf(updatedSetting.secondarySettingId) == -1) {
                  this.changedSettings.push(updatedSetting.secondarySettingId);
                }
              }
              break
            }
          }
        }
      }, this)
    }
    //console.log("Diff Array", this.changedSettings);
    return updatedSettingsList;
  }

  /**
   * Gets only the updated values by the user for different settings
   * @param updatedRemoteSettings settings changed by user
   * @param difference difference between orginal settings and changed settings
   * @param backupSettings backup of unchanged original settings received from control
   */
  getChangedSettings(updatedRemoteSettings: SettingItem[], backupSettings: SettingItem[], difference: any): Setting | null {
    //console.log("get changed settings", difference);
    if (updatedRemoteSettings.length > 0) {
      var updatedSetting: Setting = new Setting();
      console.log(updatedRemoteSettings)
      if (updatedRemoteSettings[difference.path[2]].options) {
        updatedSetting.id = updatedRemoteSettings[difference.path[2]].options[difference.path[4]].id;
        updatedSetting.settingId = updatedRemoteSettings[difference.path[2]].settingId;
        updatedSetting.secondarySettingId = updatedRemoteSettings[difference.path[2]].secondarySettingId;
        updatedSetting.moduleId = updatedRemoteSettings[difference.path[2]].moduleId;
        updatedSetting.oldValue = difference.lhs
        var changedValue = difference.rhs;
        if (updatedRemoteSettings[difference.path[2]].options[difference.path[4]].inputType == RemoteSettingsInputType.Number) {
          //If the updated value accidentally is empty then apply the old value
          if (changedValue.trim() == "") {
            changedValue = backupSettings[difference.path[2]].options[difference.path[4]].value;
          }
          //If the updated value is accidentally above or less than the max/min values then apply old value
          else if (Number(changedValue) > updatedRemoteSettings[difference.path[2]].options[difference.path[4]].maxValue || Number(changedValue) < updatedRemoteSettings[difference.path[2]].options[difference.path[4]].minValue) {
            changedValue = backupSettings[difference.path[2]].options[difference.path[4]].value;
          }

          //Round off if necessary
          if (updatedRemoteSettings[difference.path[2]].options[difference.path[4]].roundOff > 0) {
            updatedSetting.value = Number(Number(changedValue).toFixed(updatedRemoteSettings[difference.path[2]].options[difference.path[4]].roundOff));
          }
          else {
            updatedSetting.value = Number(changedValue);
          }
        }
        else {
          updatedSetting.value = changedValue;
        }
      }
      return updatedSetting;
    }
    else {
      return null;
    }
  }

  /**
   * Gets and saves the get settings response GUID from server
   */
  processGetResponseId() {
    // this.events.subscribe('receiveRequestSettingsAcknowledgement', data => {
    //   //console.log("Get settings Request Id from server", data);
    //   if (!isNullOrUndefined(data)) {
    //     this.getActiveRequestId = data;
    //   }
    // })
  }

  /**
   * Gets and saves the apply settings response GUID from server
   */
  processApplyResponseId() {
    // this.events.subscribe('receiveApplySettingsAcknowledgement', data => {
    //   //console.log('Apply settings Request Id from server', data);
    //   if (!isNullOrUndefined(data)) {
    //     this.applyActiveRequestId = data;
    //   }
    // })
  }

  /**
   * Processes the remote settings received from fusion
   */
  processReceivedRemoteSettings() {
    // this.events.subscribe('receiveRemoteSettings', data => {
    //   //console.log('JSON from control', data);
    //   //Deserializing value JSON
    //   if (!isNullOrUndefined(data)) {
    //     //Check if the response belongs to this request
    //     this.pageLoader.data.content = "Received & processing control settings"
    //     //Dismiss the page loader        
    //     if (this.isPageLoading) {
    //       this.pageLoader.present().then(() => {
    //         this.pageLoader.dismiss();
    //         this.isPageLoading = false;
    //         this.btnApplyDisabled = true;
    //       })
    //     }

    //     //Check if the control responded with errors
    //     //console.log("Check if the control responded with errors");
    //     if (data.statusCode == StatusCode.NoError) {
    //       //console.log('No errors')
    //       //if (isNullOrUndefined(this.remoteSettings)) {
    //       this.remoteSettings = this.preProcessReceivedSettings(data);
    //       //console.log('going for pre-processing')
    //       if (isNullOrUndefined(this.remoteSettings)) {
    //         this.isEmptySettingReceived = true;
    //         this.showErrorInfoTemplate = true;
    //         this.pageLoadErrorTitle = "Info";
    //         this.pageLoadErrorMessage = "No settings received from the control";
    //         //console.log('No settings received from the control')
    //       }
    //       else if (this.remoteSettings.settings.entitySettings.length == 0 && this.remoteSettings.settings.alarmSettings.length == 0) {
    //         this.isEmptySettingReceived = true;
    //         this.showErrorInfoTemplate = true;
    //         this.pageLoadErrorTitle = "Info";
    //         this.pageLoadErrorMessage = "No settings received from the control";
    //         //console.log('No settings received from the control')
    //       }
    //       else {
    //         //console.log('settings received from the control')
    //         this.hideApplyResetButtons = false;
    //         this.isAllSettingsExpanded = false;
    //         this.expandCollapseBtnTxt = "Expand all";
    //       }
    //       console.log("Remote Settings", this.remoteSettings);
    //       //}
    //     }
    //     else {
    //       this.loadHasErrors = true;
    //       this.showErrorInfoTemplate = true;
    //       this.pageLoadErrorTitle = "Error";
    //       this.pageLoadErrorMessage = data.statusDescription;
    //     }
    //     if (this.isPageRefreshRequested && (!isNullOrUndefined(this.remoteSettings))) {
    //       this.showToast("Settings refreshed successfully", 3000, true);
    //       this.isPageRefreshRequested = false;
    //       //console.log("Refresh happened");
    //     }
    //   }
    // });

  }

  /**
   * Processes the apply settings response from fusion
   */
  processSettingsUpdateAcknowledgement() {
    // this.events.subscribe('receivedRemoteSettingsAcknowledgement', data => {
    //   this.btnApplyDisabled = true;
    //   //console.log("Setting update acknowledgement", data);
    //   //Deserializing acknowlgement JSON
    //   if (!isNullOrUndefined(data)) {
    //     this.settingUpdateAcknowledgement = data;
    //     if (this.settingUpdateAcknowledgement.statusCode == 0) {
    //       if (this.isPageLoading) {
    //         this.pageLoader.present().then(() => {
    //           this.pageLoader.dismiss();
    //           this.isPageLoading = false;
    //         })
    //       }
    //       clearTimeout(this.applySettingsTimer);
    //       this.isPageRefreshAfterApply = true;
    //       console.log("Man fire", this.isManualFireClicked);
    //       //check if Manual fire is used
    //       if (this.isManualFireClicked == false) {
    //         //If no, then its a regular apply settings actions so success toast is shown
    //         this.showToast("Successfully applied the selected settings", 3000, true);
    //       }
    //       else {
    //         //If yes, then manual fire is clicked so don't show success toast
    //         this.isManualFireClicked = false;
    //       }
    //       this.getRemoteSettings();
    //       this.backupRemoteSettings = JSON.stringify(this.remoteSettings);
    //     }
    //     else {
    //       this.getRemoteSettings();
    //       this.showToast(this.settingUpdateAcknowledgement.statusDescription, 10000, true);
    //     }
    //   }

    // })
  }

  //#region Donot delete - checkbox color change logic after toggle
  //toggleCheckBoxColor(checkBoxElement: any) {
  //   if(checkBoxElement.target.parentElement.parentElement.firstElementChild.getAttribute("style")) {      
  //     if(checkBoxElement.target.parentElement.parentElement.firstElementChild.getAttribute("style") == "border-color: red") {
  //       //console.log("red")
  //       checkBoxElement.target.parentElement.parentElement.firstElementChild.setAttribute("style","border-color: #03a9f4")
  //     }
  //     else if(checkBoxElement.target.parentElement.parentElement.firstElementChild.getAttribute("style") == "border-color: #03a9f4") {
  //       //console.log("blue")
  //       checkBoxElement.target.parentElement.parentElement.firstElementChild.setAttribute("style","border-color: red")
  //     }
  //   }
  //   else {
  //     //console.log("null")
  //     checkBoxElement.target.parentElement.parentElement.firstElementChild.setAttribute("style","border-color: red")
  //   }
  // }
  //#endregion

  /**
   * Enables/Disables options on a setting based on clicking the related checkbox options 
   * @param currentSetting setting object that contains the checkbox option which is clicked
   * @param currentOption checkbox option that was clicked
   */
  toggleCheckbox(currentSetting: SettingItem, currentOption: Option) {
    //#region Donot delete - checkbox color change logic after toggle
    // this.toggleCheckBoxColor(checkBoxElement);
    //#endregion

    //console.log("Current Setting", currentSetting);
    //console.log("Current Option", currentOption);
    //get the original value for this option
    var originalValue;
    if (this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
      originalValue = this.getUnchangedOptionValue(JSON.parse(this.backupRemoteSettings).settings.entitySettings, currentSetting.settingId, currentOption.id, true);
    }
    else if (this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
      originalValue = this.getUnchangedOptionValue(JSON.parse(this.backupRemoteSettings).settings.alarmSettings, currentSetting.secondarySettingId, currentOption.id, false);
    }
    
    if (currentOption.value != originalValue) { 
      currentOption.borderColor = "danger";
    }
    else {
      currentOption.borderColor = "primary";
    }
    
    currentSetting.options.forEach(function (remoteSettingOption) {
      remoteSettingOption.conditions.forEach(function (condition: any) {
        //Check if the current condition is relevant to the current option
        if (condition.dependentId == currentOption.id) {
          //Check for option value equal to condition value
          if (condition.enabled_if.toLowerCase() == ConfigurationService.constEnabledIfequal) {
            if (currentOption.value == condition.value) {
              remoteSettingOption.enabled = true;
            }
            else {
              remoteSettingOption.enabled = false;
            }
          }
          //Check for option value not equal to condition value
          if (condition.enabled_if.toLowerCase() == ConfigurationService.constEnabledIfNotEqual) {
            if (currentOption.value != condition.value) {
              remoteSettingOption.enabled = true;
            }
            else {
              remoteSettingOption.enabled = false;
            }
          }
          //Check for option value greater than condition value
          if (condition.enabled_if.toLowerCase() == ConfigurationService.constEnabledIfGreaterThan) {
            if (currentOption.value > condition.value) {
              remoteSettingOption.enabled = true;
            }
            else {
              remoteSettingOption.enabled = false;
            }
          }
          //Check for option value lesser than condition value
          if (condition.enabled_if.toLowerCase() == ConfigurationService.constEnabledIfLessThan) {
            if (currentOption.value < condition.value) {
              remoteSettingOption.enabled = true;
            }
            else {
              remoteSettingOption.enabled = false;
            }
          }
        }

      })
    })
    this.enableApplyButton();
  }

  /**
   * Logic to expand/collapse all displayed settings based on the expand/collapse button click
   * @param unProcessedSettings available settings for expand/collapse on the expand/collapse button click
   */
  expandCollapseAllSettings(unProcessedSettings: Settings) {
    if (!this.isAllSettingsExpanded) {
      if (unProcessedSettings.entitySettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
        unProcessedSettings.entitySettings.forEach(function (settingItem) {
          settingItem.isSettingExpanded = true;
          settingItem.cssClass = "settings-card-content-max";
          settingItem.expandCollapseIcon = "arrow-up";
        })
      }
      else if (unProcessedSettings.alarmSettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
        unProcessedSettings.alarmSettings.forEach(function (settingItem) {
          settingItem.isSettingExpanded = true;
          settingItem.cssClass = "settings-card-content-max";
          settingItem.expandCollapseIcon = "arrow-up";
        })
      }
      this.isAllSettingsExpanded = true;
      this.expandCollapseBtnTxt = "Collapse all";
    }
    else {
      if (unProcessedSettings.entitySettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
        unProcessedSettings.entitySettings.forEach(function (settingItem) {
          settingItem.isSettingExpanded = false;
          settingItem.cssClass = "settings-card-content-min";
          settingItem.expandCollapseIcon = "arrow-down";
        })
      }
      else if (unProcessedSettings.alarmSettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
        unProcessedSettings.alarmSettings.forEach(function (settingItem) {
          settingItem.isSettingExpanded = false;
          settingItem.cssClass = "settings-card-content-min";
          settingItem.expandCollapseIcon = "arrow-down";
        })
      }
      this.isAllSettingsExpanded = false;
      this.expandCollapseBtnTxt = "Expand all";
    }
  }

  //#region Expand/Collapse settings - Alternate version - Donot delete
  // expandAllSettings(unProcessedSettings: Settings) {
  //   if (unProcessedSettings.entitySettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
  //     unProcessedSettings.entitySettings.forEach(function (settingItem) {
  //       settingItem.isSettingExpanded = true;
  //       settingItem.cssClass = "settings-card-content-max";
  //       settingItem.expandCollapseIcon = "arrow-up";
  //     })
  //   }
  //   else if (unProcessedSettings.alarmSettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
  //     unProcessedSettings.alarmSettings.forEach(function (settingItem) {
  //       settingItem.isSettingExpanded = true;
  //       settingItem.cssClass = "settings-card-content-max";
  //       settingItem.expandCollapseIcon = "arrow-up";
  //     })
  //   }
  // }

  // collapseAllSettings(unProcessedSettings: Settings) {
  //   if (unProcessedSettings.entitySettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
  //     unProcessedSettings.entitySettings.forEach(function (settingItem) {
  //       settingItem.isSettingExpanded = false;
  //       settingItem.cssClass = "settings-card-content-min";
  //       settingItem.expandCollapseIcon = "arrow-down";
  //     })
  //   }
  //   else if (unProcessedSettings.alarmSettings != null && this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
  //     unProcessedSettings.alarmSettings.forEach(function (settingItem) {
  //       settingItem.isSettingExpanded = false;
  //       settingItem.cssClass = "settings-card-content-min";
  //       settingItem.expandCollapseIcon = "arrow-down";
  //     })
  //   }
  // }
  //#endregion


  /**
   * Initializes the expand/collpase, roundoff and border color of all received settings before rendering controls 
   * @param unProcessedSettings settings to be modified before rendering UI
   */
  processEntityOrAlarmSettings(unProcessedSettings: SettingItem[]): SettingItem[] {
    unProcessedSettings.forEach((setting) => {
      //initializing values for the cssClass and expandCollapseIcon
      setting.cssClass = "settings-card-content-min";
      setting.expandCollapseIcon = "arrow-down";
      setting.isSettingExpanded = false;

      if (this.changedSettings) {
        if (this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
          if (this.changedSettings.indexOf(setting.settingId) != -1) {
            setting.cssClass = "settings-card-content-max";
            setting.expandCollapseIcon = "arrow-up";
            setting.isSettingExpanded = true;
          }
        }
        else if (this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
          if (this.changedSettings.indexOf(setting.secondarySettingId) != -1) {
            setting.cssClass = "settings-card-content-max";
            setting.expandCollapseIcon = "arrow-up";
            setting.isSettingExpanded = true;
            //console.log("setting card content max");
          }
        }
      }


      setting.options.forEach((option: any) => {
        //Rounding off values, maxValue and minValue based on round off value        
        if (option.roundOff != null) {
          option.roundOff = 2;
        } else if (option.roundOff == -1) {
          option.roundOff = 2;
        }
        if (option.inputType == RemoteSettingsInputType.Number) {
          option.value = Number(Number(option.value).toFixed(option.roundOff));
          option.maxValue = Number(Number(option.maxValue).toFixed(option.roundOff));
          option.minValue = Number(Number(option.minValue).toFixed(option.roundOff));
          option.step = Number(Number(option.step).toFixed(option.roundOff));
        }

        //Rounding off values in condition based on round off value in the option
        option.conditions.forEach((condition: any) => {
          if (isNumber(condition.value)) {
            condition.value = Number(Number(condition.value).toFixed(option.roundOff));
          }
        }, this)

        //setting border color to original
        if (option.inputType == RemoteSettingsInputType.Switch) {
          option.borderColor = 'primary';
        }
        else {
          option.borderColor = '#03A9F4';
        }
        if (option.conditions.length > 0) {
          option.conditions.forEach((condition: any) => {
            var dependencyOption: any = setting.options.find(op => op.id == condition.dependentId)
            if (condition.enabled_if.toString().toLowerCase().trim() == ConfigurationService.constEnabledIfequal) {
              if (dependencyOption.value == condition.value) {
                option.enabled = true;
              }
              else {
                option.enabled = false;
              }
            }
            else if (condition.enabled_if.toString().toLowerCase().trim() == ConfigurationService.constEnabledIfNotEqual) {
              if (dependencyOption.value != condition.value) {
                option.enabled = true;
              }
              else {
                option.enabled = false;
              }
            }
            else if (condition.enabled_if.toString().toLowerCase().trim() == ConfigurationService.constEnabledIfDifferent) {
              if (dependencyOption.value != condition.value) {
                option.enabled = true;
              }
              else {
                option.enabled = false;
              }
            }
          })
        }
        else {
          option.enabled = true
        }

      }, this)

    }, this)
    this.changedSettings = [];
    return unProcessedSettings;
  }

  /**
   * First level validation of received settings before pre-processing
   * @param unProcessedData  settings to be modified before rendering UI
   */
  preProcessReceivedSettings(unProcessedData: RemoteSettings): RemoteSettings {
    //console.log("Unprocessed JSON", unProcessedData);
    var processedSettings = null;
    if (unProcessedData.settings != null) {
      switch (this.entityData.remoteSettingType) {
        case RemoteSettingCommandType.EntitySettings: {
          if (unProcessedData.settings.entitySettings != null) {
            if (unProcessedData.settings.entitySettings.length > 0) {
              //console.log("Un processed entity settings", unProcessedData.settings.entitySettings)
              unProcessedData.settings.entitySettings = this.processEntityOrAlarmSettings(unProcessedData.settings.entitySettings);
              //console.log("Pre processed entity settings", unProcessedData.settings.entitySettings)
            }
          }
          break;
        }
        case RemoteSettingCommandType.AlarmSettings: {
          if (unProcessedData.settings.alarmSettings != null) {
            if (unProcessedData.settings.alarmSettings.length > 0) {
              //console.log("Un processed alarm settings", unProcessedData.settings.alarmSettings)
              unProcessedData.settings.alarmSettings = this.processEntityOrAlarmSettings(unProcessedData.settings.alarmSettings);
              //console.log("Pre processed alarm settings", unProcessedData.settings.alarmSettings)
            }
          }
        }
      }
    }

    //Sorting options based on "placement" property
    //take a backup of the object for reverting back to original settings
    processedSettings = this.sortRemoteSettings(unProcessedData);
    this.createRemoteSettingsBackup(processedSettings);

    //return the pre-processed JSON
    return processedSettings;
  }


  /**
   * Creates a backup of unprocessed received settings object for future comparisons
   * @param controlSettings unmodified settings received from control
   */
  createRemoteSettingsBackup(controlSettings: RemoteSettings) {
    this.backupRemoteSettings = JSON.stringify(controlSettings);
  }


  /**
   * Logic to enable/disable apply & reset buttons
   */
  enableApplyButton() {
    // var diff = require('deep-diff');
    // this.remoteSettingChanges = diff(this.sortRemoteSettings(JSON.parse(this.backupRemoteSettings)), this.remoteSettings, (path: any, key: any) => path.length != 0 && ~['cssClass', 'expandCollapseIcon', 'isSettingExpanded'].indexOf(key));
    // //console.log("differences", this.remoteSettingChanges);
    // //console.log("Remote Settings", this.remoteSettings);
    // //console.log("Backup settings", this.sortRemoteSettings(JSON.parse(this.backupRemoteSettings)));
    // if (this.remoteSettingChanges) {
    //   this.btnApplyDisabled = false;
    // }
    // else {
    //   this.btnApplyDisabled = true;
    // }
  }

  /**
   * Checks user access level for settings and showing messages if user doesn't have edit access
   * @param currentSetting setting clicked by the user 
   */
  checkIsSettingEnabled(currentSetting: SettingItem) {
    if (currentSetting.editable == false) {
      this.showToast("You do not have proper access level", 3000, true);
      //Other error messages in consideration are 
      //Not enough security level access to change this setting
      //Cannot edit, Insufficient security level access
    }
  }

  //#region Donot delete - Input Step validation - may require in future
  // validateInputStep(currentOption: Option, numberTextBox: any, minValue: number, maxValue: number) {
  //   var newValue = Number(numberTextBox.value);
  //   var step = currentOption.step;
  //   if (newValue != this.oldValue && (newValue * 1000) % (step * 1000) != 0 && !(currentOption.value > currentOption.maxValue || currentOption.value < currentOption.minValue)) {
  //     this.showToast("Value can be incremented/decremented only on steps of " + currentOption.step, 5000);
  //     currentOption.value = this.oldValue;
  //   }
  //   currentOption.value = Number(currentOption.value);

  //   this.enableApplyButton();
  //}
  //#endregion

  /**
   * Validates if the user entered value is within max/min ranges for that option
   * @param currentSetting setting that contains the number textbox option where the value is changed
   * @param currentOption option that contains the number textbox control where the value is changed
   */
  validateMaxMinRange(currentSetting: SettingItem, currentOption: Option) {
    //console.log("option", currentOption);
    //console.log("settingId", currentSetting.settingId);
    //console.log("secondarySettingId", currentSetting.secondarySettingId);
    if (currentOption.value) {
      if (Number(currentOption.value) > currentOption.maxValue) {
        this.showToast("Value cannot be greater than max range " + currentOption.maxValue, 5000, true);
        if (this.oldValue != null) {
          currentOption.value = this.oldValue;
        }
      }
      else if (Number(currentOption.value) < currentOption.minValue) {
        this.showToast("Value cannot be lesser than min range " + currentOption.minValue, 5000, true);
        if (this.oldValue != null) {
          currentOption.value = this.oldValue;
        }
      }
    }

    this.enableApplyButton();
  }

  /**
   * Gets the original value received from the fusion for an option
   * @param backupSettings Backup of the unchanged settings received from control
   * @param settingId settingId of the current setting
   * @param optionId optionId of the current option
   * @param isEntitySettings flag to check settings type
   */
  getUnchangedOptionValue(backupSettings: SettingItem[], settingId: number, optionId: number, isEntitySettings: boolean): any {
    if (isEntitySettings) {
      if (backupSettings.find(sett => sett.settingId == settingId)?.options.find(op => op.id == optionId)?.inputType == RemoteSettingsInputType.Number) {
        return Number(backupSettings.find(sett => sett.settingId == settingId)!.options.find(op => op.id == optionId)!.value);
      }
      else {
        return backupSettings.find(sett => sett.settingId == settingId)?.options.find(op => op.id == optionId)?.value;
      }
    }
    else {
      if (backupSettings.find(sett => sett.secondarySettingId == settingId)?.options.find(op => op.id == optionId)?.inputType == RemoteSettingsInputType.Number) {
        return Number(backupSettings.find(sett => sett.secondarySettingId == settingId)!.options.find(op => op.id == optionId)!.value);
      }
      else {
        return backupSettings.find(sett => sett.secondarySettingId == settingId)?.options.find(op => op.id == optionId)?.value;
      }
    }
  }

  /**
   * Saves the old value for an option before user edit happens   
   * @param optionOldValue Unchanged value available during load
   */
  saveOldvalue(optionOldValue: string) {
    if (optionOldValue != null) {
      this.oldValue = optionOldValue;
    }
    else {
      this.oldValue = "0";
    }
  }

  //#region Convert the input to number may be needed in future, donot delete
  // convertToNumber(currentOption: Option) {
  // if (!isNullOrUndefined(currentOption.value)) {
  //   currentOption.value = Number(currentOption.value);
  //   //console.log("Changed number", currentOption.value);
  // }
  // }
  //#endregion

  /**
   * Validation to check if the user input is a valid number for a numeric option
   * @param changedNumber user updated value
   * @param currentOption option that was changed by user
   */
  checkIfNumberValid(changedNumber: any, currentOption: Option, currentSetting: SettingItem) {
    //console.log("checkIfNumberValid")
    if (currentOption.value) {
      if (!isNaN(Number(currentOption.value))) {
        if (currentOption.roundOff == 0) {
          if (changedNumber.target.value.endsWith(".")) {
            //console.log("before", changedNumber.target.value)
            currentOption.value = changedNumber.target.value.replace(".", "")
            //console.log("after", changedNumber.target.value)
          }
        }
      }
      else {
        if (currentOption.value.toString().trim() != "-") {
          this.showToast("Please enter a valid number", 5000, true);
          currentOption.value = this.oldValue;
        }
      }
    }

    //enable/disable textbox based on dependent_value_different
    currentSetting.options.forEach(function (remoteSettingOption) {
      remoteSettingOption.conditions.forEach((condition: any) => {
        if (condition.enabled_if.toLowerCase() == ConfigurationService.constEnabledIfDifferent) {
          if (currentOption.value != condition.value) {
            remoteSettingOption.enabled = true
          }
          else {
            remoteSettingOption.enabled = false;
          }
        }
      })
    })

    //get the original value for this option
    var originalValue;
    if (this.entityData.remoteSettingType == RemoteSettingCommandType.EntitySettings) {
      originalValue = this.getUnchangedOptionValue(JSON.parse(this.backupRemoteSettings).settings.entitySettings, currentSetting.settingId, currentOption.id, true);
    }
    else if (this.entityData.remoteSettingType == RemoteSettingCommandType.AlarmSettings) {
      originalValue = this.getUnchangedOptionValue(JSON.parse(this.backupRemoteSettings).settings.alarmSettings, currentSetting.secondarySettingId, currentOption.id, false);
    }

    if (currentOption.value != originalValue) {
      currentOption.borderColor = 'red';
      //console.log("value change flag", this.isValueChanged);
    }
    else {
      currentOption.borderColor = '#03A9F4'
    }

    this.enableApplyButton();
  }

  /**
   * Sort the recieved settings based on the placement field before rendering page
   * @param remoteSettingsToSort Unsorted remote settings received from the control
   */
  sortRemoteSettings(remoteSettingsToSort: RemoteSettings): RemoteSettings {
    remoteSettingsToSort.settings.entitySettings.forEach(function (setting) {
      setting.options = setting.options.sort((a, b) => a.placement - b.placement);
    })
    remoteSettingsToSort.settings.entitySettings.sort((a, b) => a.placement - b.placement);
    return remoteSettingsToSort;
  }

  /**
   * Resets all settings values back to original when user clicks on Reset button
   */
  resetToOriginal() {
    this.remoteSettings = JSON.parse(this.backupRemoteSettings);
    this.btnApplyDisabled = true;
    this.showToast('Successfully reset to original settings', 3000, true);
  }


  //#region Confirmation alert - deemed un-necessary after demo - can stay until final build
  // async PresentAlert(alertTitle: string, alertSubTitle: string, alertMessage: string, alertConfirmationMessage: string = null) {
  //   const remoteSettingsAlert = await this.alertController.create({
  //     title: alertTitle,
  //     subTitle: alertSubTitle,
  //     message: alertMessage,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }, {
  //         text: 'Okay',
  //         role: 'okay',
  //         handler: () => {
  //           if (alertTitle == 'Apply Settings') {
  //             //submit success toast message
  //             this.applySettings();
  //             // setTimeout(() => {
  //             //  this.showToast(alertConfirmationMessage, 3000);
  //             // }, 5000);
  //           }
  //           else {
  //             //reset success toast message
  //             this.resetToOriginal();              
  //           }

  //         }
  //       }
  //     ]
  //   });
  //   await remoteSettingsAlert.present();
  // }
  //#endregion

  /**
   * Shows different types of notification messages for various user actions
   * @param toastMessage Message to be displayed on the toast
   * @param timeout Determines how long the toast should be open (in milliseconds)
   * @param shouldShowCloseButton Flag to determine if the displayed toast should have an explicit close button
   */
  async showToast(toastMessage: string, timeout: number, shouldShowCloseButton: boolean) {

    let statusToast: any = await this.toastController.create({
      message: toastMessage,
      duration: timeout,
      position: 'bottom',
      // showCloseButton: shouldShowCloseButton,
      // dismissOnPageChange: true,
      // closeButtonText: 'Close'
    })

    statusToast.onDidDismiss().then(() => {
      statusToast = null;
    });

    statusToast.present();

  }


}
