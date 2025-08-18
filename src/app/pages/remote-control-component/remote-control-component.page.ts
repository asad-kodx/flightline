import { Device } from './../../shared/models/device-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Gesture, NavController, NavParams, ModalController, MenuController, Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { RemoteControlService } from 'src/app/core/services/remote-control-service';
import { Device, Control, Mode, FusionFeatureFlag, RemoteControlCommandType, Bin } from 'src/app/shared/models';

@Component({
  selector: 'app-remote-control-component',
  templateUrl: './remote-control-component.page.html',
  styleUrls: ['./remote-control-component.page.scss'],
})
export class RemoteControlComponentPage implements OnInit {

  public entity: Device;
  public controls!: Observable<Control[]>;
  public mode!: Mode;
  public value: number = 0;
  public type!: string;
  public infoCollapsed: boolean = true;
  public variableSwitchImage: any = "assets/others/tumbler_center.svg";
  public booleanSwitchImageLeft: any = "assets/others/tumbler_down.svg";
  public booleanSwitchImageRight: any = "assets/others/tumbler_down.svg";
  public chainDiskSwitchImage: any = "assets/others/tumbler_down.svg";
  public curtainSwitchImageLeft: any = "assets/others/tumbler_down.svg";
  public curtainSwitchImageRight: any = "assets/others/tumbler_down.svg";
  public curtainManualBolden: boolean = true;
  public autoBolden!: boolean;
  public manualBolden!: boolean;
  public stopBolden!: boolean;
  public offBolden: boolean = true;
  public onBolden!: boolean;
  public openBolden!: boolean;
  public curtainStopBolden!: boolean;
  public closeBolden!: boolean;
  public resetMode!: Mode;
  // public resetSwitch: number;
  public resetValue: number = 0;
  public resetAuxSwitch!: number;
  public resetCurtainRight: string = "stop";
  public resetBooleanRight: string = "off";
  private requestId!: string;
  public activeRequest!: boolean;
  public resetRequest!: boolean;
  private gesture!: Gesture;
  protected liveValuesMap: Observable<Map<string, any>>;
  public activeId!: string;
  private calibrateClicked: boolean;
  private control: Control;
  public featureFlagRc: any;
  private intialLv: any;
  private initValue!: number;
  private initMode!: Mode;


  @ViewChild('autoButton') autoButton: any;
  @ViewChild('manualButton') manualButton: any;
  @ViewChild('stopButton') stopButton: any;
  @ViewChild('onButton') onButton: any;
  @ViewChild('offButton') offButton: any;
  @ViewChild('openButton') openButton: any;
  @ViewChild('closeButton') closeButton: any;
  @ViewChild('stopCurtainButton') stopCurtainButton: any;
  @ViewChild('submitButton') submitButton: any;
  @ViewChild('variableSlider') variableSlider: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private remoteControlService: RemoteControlService, private controlData: ControlDataProvider,
    private modalCtrl: ModalController, private menuCtrl: MenuController, private lvService: LiveValueService,
    private roomData: RoomDataProvider, private lvSub: LiveValuesSubscription, private platform: Platform) {
    this.entity = this.navParams.data['data'];
    if (this.entity.entitySerialNumber) {
      this.entity = this.roomData.getEntity(this.entity.entitySerialNumber) || ;
    }
    this.setButtons();
    this.liveValuesMap = this.lvService.getLiveValuesBinding();
    this.calibrateClicked = false;
    this.control = this.controlData.getControl(this.entity.controlSerialNumber)!;


    this.featureFlagRc = FusionFeatureFlag.RemoteSettings;


  }

  ionViewDidLoad() {
    this.control = this.controlData.getControl(this.entity.controlSerialNumber)!;
    if (!this.control) return;
    this.type = this.remoteControlService.getDeviceType(this.entity.deviceType, this.control.version, this.control.fusionFeatureVersion) || "";
    this.sub = this.liveValuesMap.subscribe(map => {
      if (map) {
        var lv = map.get(this.entity.deviceSerialNumber)
        if (lv && !this.activeRequest) this.calibrateClicked = false;
        if (!this.intialLv) {
          this.intialLv = lv;
          this.initializeButtonValues();
        }
      }
    })
    window.setTimeout(() => {
      if (this.variableSlider) this.variableSlider.nativeElement.addEventListener('touchmove', e => {

        window.scroll(window.scrollX, window.scrollY);

      }, false);
    }, 1000)

  }

  collapseInfo() {
    if (this.infoCollapsed === true) {
      this.infoCollapsed = false;
    } else {
      this.infoCollapsed = true;
    }
  }

  initializeButtonValues() {
    if (!this.intialLv) {
      this.mode = 0;
      this.value = 0;
      this.initValue = this.value;
      this.initMode = this.mode;
    }
    console.log("Initing switches", this.intialLv, this.initValue, this.initMode)
    if(this.intialLv != null && (this.initValue == undefined || this.initMode == undefined)){
      
      this.mode = Number(this.intialLv.mode);
      this.value = Number(this.intialLv.value);
      if (this.value < 0 || this.value > 100) this.value = 0;
      if (this.intialLv.valueObject.manualModeValue != null) {
        this.value = this.intialLv.valueObject.manualModeValue;
        this.hasSliderValue = true;
      }
      this.initValue = this.value;
      this.initMode = this.mode;
    }
    switch (this.type) {
      case 'boolean':
        this.changeBooleanSwitchImageLeft(this.mode);
        this.changeBooleanSwitchImageRight(this.value);
        return;
      case 'variable':
      case 'curtain2':
        this.changeVariableSwitchImage(this.mode);
      case 'curtain':
        this.changeCurtainSwitchImageLeft(this.mode);
        this.changeCurtainSwitchImageRight(this.value);
      case 'chainDisk':
      case 'chainDisk2':
      case 'mixingProcess':
        this.changeChainDiskSwitchImage(this.mode);
    }
  }

  changeVariableSwitchImage(mode: any) {
    console.log("Changing variable switch image", mode)
    switch (mode) {
      case Mode.Auto:
        this.variableSwitchImage = "assets/others/tumbler_up.svg";
        this.autoBolden = true;
        this.manualBolden = false;
        this.stopBolden = false;
        break;
      case Mode.Stop:
        this.variableSwitchImage = "assets/others/tumbler_center.svg";
        this.autoBolden = false;
        this.manualBolden = false;
        this.stopBolden = true;
        break;
      case Mode.Manual:
        this.variableSwitchImage = "assets/others/tumbler_down.svg";
        this.autoBolden = false;
        this.manualBolden = true;
        this.stopBolden = false;
        break;
      default:
        this.variableSwitchImage = "assets/others/tumbler_center.svg";
        this.autoBolden = false;
        this.manualBolden = false;
        this.stopBolden = true;
        break;
    }
  }

  changeBooleanSwitchImageLeft(mode) {
    console.log('Changing boolean switch', mode)
    switch (mode) {
      case Mode.Manual:
        this.booleanSwitchImageLeft = "assets/others/tumbler_down.svg";
        this.manualBolden = true;
        this.autoBolden = false;
        this.changeBooleanSwitchImageRight(this.value)
        break;
      case Mode.Auto:
        this.booleanSwitchImageLeft = "assets/others/tumbler_up.svg";
        this.manualBolden = false;
        this.autoBolden = true;
        this.changeBooleanSwitchImageRight(this.value)
        break;
      default:
        this.booleanSwitchImageLeft = "assets/others/tumbler_down.svg";
        this.manualBolden = true;
        this.autoBolden = false;
        this.changeBooleanSwitchImageRight(this.value)
        break;
    }
  }

  // boolean switch: 0-down, 1-up, default-down
  changeBooleanSwitchImageRight(caseNum: number) {
    console.log(caseNum, this.autoBolden)
    switch (caseNum) {
      case 0:
        this.booleanSwitchImageRight = "assets/others/tumbler_down.svg";
        if(this.autoBolden) this.booleanSwitchImageRight = "assets/others/tumbler_down_disabled.svg";
        break;
      case 1:
        this.booleanSwitchImageRight = "assets/others/tumbler_up.svg";
        if(this.autoBolden) this.booleanSwitchImageRight = "assets/others/tumbler_up_disabled.svg";
        break;
      default:
        this.booleanSwitchImageRight = "assets/others/tumbler_down.svg";
        if(this.autoBolden) this.booleanSwitchImageRight = "assets/others/tumbler_down_disabled.svg";
        break;
    }
  }

  changeChainDiskSwitchImage(caseNum: number) {
    switch (caseNum) {
      case 0:
        this.chainDiskSwitchImage = "assets/others/tumbler_up.svg";
        break;
      case 1:
        this.chainDiskSwitchImage = "assets/others/tumbler_down.svg";
        break;
      default:
        this.chainDiskSwitchImage = "assets/others/tumbler_down.svg";
        break;
    }
  }

  changeCurtainSwitchImageLeft(caseNum: number) {
    console.log("Changing curtain image switch", caseNum)
    switch (caseNum) {
      case 1:
        this.curtainSwitchImageLeft = "assets/others/tumbler_down.svg";
        this.curtainManualBolden = true;
        this.autoBolden = false;
        this.changeCurtainSwitchImageRight(this.value)
        break;
      case 0:
        this.curtainSwitchImageLeft = "assets/others/tumbler_up.svg";
        this.curtainManualBolden = false;
        this.autoBolden = true;
        this.changeCurtainSwitchImageRight(this.value)
        break;
      default:
        this.curtainSwitchImageLeft = "assets/others/tumbler_down.svg";
        this.changeCurtainSwitchImageRight(this.value)
        break;
    }
  }

  toggleCurtain() {
    if (this.mode == Mode.Manual) {
      this.mode = Mode.Auto;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeCurtainSwitchImageLeft(this.mode);
      
    }
    else {
      this.mode = Mode.Manual;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeCurtainSwitchImageLeft(this.mode);
      
      
    }
  }

  changeCurtainSwitchImageRight(caseNum: number) {
    switch (caseNum) {
      case 0:
        this.curtainSwitchImageRight = "assets/others/tumbler_center.svg";
        if(this.autoBolden)  this.curtainSwitchImageRight = "assets/others/tumbler_center_disabled.svg";
        this.curtainStopBolden = true;
        break;
      case 1:
        this.curtainSwitchImageRight = "assets/others/tumbler_down.svg";
        if(this.autoBolden)  this.curtainSwitchImageRight = "assets/others/tumbler_down_disabled.svg";

        this.openBolden = true;
        break;
      case 2:
        this.curtainSwitchImageRight = "assets/others/tumbler_up.svg";
        if(this.autoBolden)  this.curtainSwitchImageRight = "assets/others/tumbler_up_disabled.svg";

        this.closeBolden = true;
        break;
      default:
        this.curtainSwitchImageRight = "assets/others/tumbler_center.svg";
        break;
    }
  }

  setButtons() {

    if (this.entity.hideManualControl) return;
    if (!this.type) return;
    if (this.mode == null) return;
  }

  autoPress() {
    this.mode = Mode.Auto;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeVariableSwitchImage(this.mode);
  }

  manualPress() {
    this.mode = Mode.Manual;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeVariableSwitchImage(this.mode);
  }

  stopPress() {
    this.mode = Mode.Stop;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeVariableSwitchImage(this.mode);
  }

  boolAutoPress() {
    this.mode = Mode.Auto;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeBooleanSwitchImageLeft(this.mode);
    this.manualBolden = false;
    this.autoBolden = true;
  }

  boolManualPress() {
    this.mode = Mode.Manual;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeBooleanSwitchImageLeft(this.mode);
    this.manualBolden = true;
    this.autoBolden = false;
  }

  booleanToggle() {
    if (this.mode == Mode.Manual) {
      this.mode = Mode.Auto;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageLeft(this.mode);
      this.manualBolden = false;
      this.autoBolden = true;
    }
    else {
      this.mode = Mode.Manual;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageLeft(this.mode);
      this.manualBolden = true;
      this.autoBolden = false;
    }
  }

  booleanValueToggle() {
    if (this.value == 1) {
      this.value = 0;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageRight(this.value);
    }
    else {
      this.value = 1;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageRight(this.value);
    }
  }

  variableToggle() {
    if (this.mode == Mode.Manual) {
      this.mode = Mode.Auto;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeVariableSwitchImage(this.mode);
      this.manualBolden = false;
      this.autoBolden = true;
    }
    else {
      this.mode = Mode.Manual;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeVariableSwitchImage(this.mode);
      this.manualBolden = true;
      this.autoBolden = false;
    }
  }

  onPress() {
    if (this.manualBolden || this.resetBooleanRight == "on") {
      this.value = 1;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageRight(1);
      this.onBolden = true;
      this.offBolden = false;
    }
  }

  offPress() {
    if (this.manualBolden || this.resetBooleanRight == "on") {
      this.value = 0;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeBooleanSwitchImageRight(0);
      this.onBolden = false;
      this.offBolden = true;
    }
  }

  chainDiskAutoPress() {
    this.mode = Mode.Auto;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeChainDiskSwitchImage(0);
    this.autoBolden = true;
    this.offBolden = false;
  }

  chainDiskOffPress() {
    this.mode = Mode.Stop;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeChainDiskSwitchImage(1);
    this.autoBolden = false;
    this.offBolden = true;
  }

  chainDiskToggle() {
    if (this.mode == Mode.Auto) {
      this.mode = Mode.Stop;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeChainDiskSwitchImage(1);
      this.autoBolden = false;
      this.offBolden = true;
    }
    else {
      this.mode = Mode.Auto;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeChainDiskSwitchImage(0);
      this.autoBolden = true;
      this.offBolden = false;
    }
  }

  mixingProcessOffPress() {
    this.mode = Mode.Manual;
    this.value = 0;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeChainDiskSwitchImage(1);
    this.autoBolden = false;
    this.offBolden = true;
  }

  openCurtainPress() {
    if (this.curtainManualBolden) {
      this.value = 1,
        window.setTimeout(() => this.setButtons(), 100);
      this.changeCurtainSwitchImageRight(1);
      this.openBolden = true;
      this.curtainStopBolden = false;
      this.closeBolden = false;
    }
  }

  closeCurtainPress() {
    if (this.curtainManualBolden) {
      this.value = 2;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeCurtainSwitchImageRight(2);
      this.openBolden = false;
      this.curtainStopBolden = false;
      this.closeBolden = true;
    }
  }

  stopCurtainPress() {
    if (this.curtainManualBolden) {
      this.value = 0;
      window.setTimeout(() => this.setButtons(), 100);
      this.changeCurtainSwitchImageRight(0);
      this.openBolden = false;
      this.curtainStopBolden = true;
      this.closeBolden = false;
    }
  }

  curtainManualPress() {
    this.mode = Mode.Manual;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeCurtainSwitchImageLeft(0);
    this.curtainManualBolden = true;
    this.autoBolden = false;
  }

  curtainAutoPress() {
    this.mode = Mode.Auto;
    window.setTimeout(() => this.setButtons(), 100);
    this.changeCurtainSwitchImageLeft(1);
    this.curtainManualBolden = false;
    this.autoBolden = true;
  }

  pressPlusButton() {
    if (this.value < 100) this.value += 1;
  }

  pressMinusButton() {
    if (this.value > 0) this.value -= 1;
  }

  disableSubmit() {
    if(this.activeId) return false;
    if(!this.intialLv) return false;
    if ((this.mode == null) || (this.mode == 1 && this.value == null)) return true;
    if (this.initMode == null && this.initValue == null) return false;
    return this.initValue == this.value && this.initMode == this.mode;
  }


  submit() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    if ((this.control.fusionFeatureVersion & FusionFeatureFlag.RemoteSettings) == FusionFeatureFlag.RemoteSettings) {
      //Construct the new V2 request 
      console.log("Available");
    }
    else {
      //Construct the V1 request
    }
    //console.log("current feature version", this.control.fusionFeatureVersion);
    //console.log("And fusion", this.control.fusionFeatureVersion & FusionFeatureFlag.LocalVnc );
    //console.log("Feature available", (this.control.fusionFeatureVersion & FusionFeatureFlag.Reports) == FusionFeatureFlag.Reports);
    this.activeRequest = true;
    this.resetValue = this.value;
    switch (this.mode) {
      case Mode.Auto:
        this.resetMode = Mode.Auto;
        break;
      case Mode.Manual:
        this.resetMode = Mode.Manual;
        if (this.closeBolden) this.resetCurtainRight = "close";
        if (this.openBolden) this.resetCurtainRight = "open";
        if (this.curtainStopBolden) this.resetCurtainRight = "stop";
        if (this.onBolden) this.resetBooleanRight = "on";
        if (this.offBolden) this.resetBooleanRight = "off";
        break;
      case Mode.Stop:
        this.resetMode = Mode.Stop;
        this.value = 0;
        this.resetValue = 0;
        break;
    }

    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, this.mode, this.value, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  go() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;
    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, this.mode, 1, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  pause() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;
    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, Mode.Auto, 1, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  resume() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;
    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, Mode.Auto, 0, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  restart() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;
    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, Mode.Auto, 2, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  calibrate(value: number) {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;
    this.calibrateClicked = true;
    if (value == 0) this.calibrateClicked = false;
    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, this.mode, value, RemoteControlCommandType.CalibrateCurtain, this.control.fusionFeatureVersion);
    this.initValue = this.value;
    this.initMode = this.mode;
  }

  reset() {
    this.mode = this.initMode;
    this.value = this.initValue;
    this.initializeButtonValues();
    // this.resetRequest = true;
    // this.value = this.initValue;
    // this.mode = this.initMode;
    // if (this.mode == Mode.Stop) {
    //   this.resetValue = 0;
    //   this.chainDiskOffPress();
    // }
    // if (this.mode == Mode.Auto) {
    //   this.chainDiskAutoPress();
    //   this.curtainAutoPress();
    // }
    // if (this.mode == Mode.Manual) {
    //   this.curtainManualPress();
    //   if (this.resetCurtainRight == "close") this.closeCurtainPress();
    //   if (this.resetCurtainRight == "open") this.openCurtainPress();
    //   if (this.resetCurtainRight == "stop") this.stopCurtainPress();
    //   if (this.resetBooleanRight == "on") this.onPress();
    //   if (this.resetBooleanRight == "off") this.offPress();
    //   this.value = this.resetValue;
    // }

    // window.setTimeout(() => this.setButtons(), 100);

    // this.changeVariableSwitchImage(this.mode);
    // this.changeBooleanSwitchImageLeft(this.mode);
    // if (this.value == 1) {
    //   this.onBolden = true;
    //   this.offBolden = false;
    //   this.changeBooleanSwitchImageRight(1);
    // } else if (this.value == 0) {
    //   this.offBolden = true;
    //   this.onBolden = false;
    //   this.changeBooleanSwitchImageRight(0);
    // }

    // this.resetRequest = false;
  }

  ionViewWillEnter() {
    if (this.navCtrl.getPrevious().component.name != "Rooms") {
      this.nav.swipeBackEnabled = false;
      this.menuCtrl.swipeEnable(false);
    }
    if (this.entity.hideManualControl) return;
    if (!this.type) return;
    this.events.subscribe('CheckRequestId', data => {
      console.log(data, this.requestId)
      if (data.requestId == this.requestId) {
        this.activeRequest = false;
        this.requestLiveValue();
        window.setTimeout(() => {
          this.gesture = new Gesture(this.submitButton._elementRef.nativeElement);
          this.gesture.options({
            press: { time: 0 }
          });
          this.gesture.listen();

          this.gesture.on('press', e => {
            this.submitButton._style = 'default';
          })
          this.gesture.on('pressup', e => {
            this.submitButton._style = 'outline';
            //this.submit();
          })
        }, 100);
      }
    });
    this.events.subscribe('GetRequestId', () => {
      this.requestId = this.remoteControlService.getRequestId(this.entity.deviceSerialNumber);
      if (this.requestId) this.activeRequest = true;
      else this.activeRequest = false;
    });
    this.events.subscribe('RequestTimeout', () => {
      this.calibrateClicked = false;
      this.timedOut = this.remoteControlService.isTimedOut(this.entity.deviceSerialNumber);
      this.remoteControlService.displayTimeOutToast();
      this.activeRequest = false;
    });
    this.events.subscribe('PostFailed', () => {
      this.calibrateClicked = false;
      this.activeRequest = false;
    });
    this.events.subscribe('AlarmControlTabs', alarm => {
      this.navCtrl.push('alarm-details-tabs', { alarm: alarm, nav: this.navCtrl });
    });
    this.gesture = new Gesture(this.submitButton._elementRef.nativeElement);
    this.gesture.options({
      press: { time: 0 }
    });
    this.gesture.listen();

    this.gesture.on('press', e => {
      this.submitButton._style = 'default';
    })
    this.gesture.on('pressup', e => {
      this.submitButton._style = 'outline';
      //this.submit();
    })
  }

  ionViewWillLeave() {
    //this.liveValueRequestor.unsubscribe();
    this.events.unsubscribe('GetRequestId');
    this.events.unsubscribe('CheckRequestId');
    this.events.unsubscribe('RequestTimeout');
    this.events.unsubscribe('AlarmControlTabs')
  }

  private requestLiveValue() {
    this.lvSub.requestLiveValuesForControl(this.control.serialNumber).subscribe();
  }

  toggleBin(bin: Bin) {
    this.activeId = bin.id;
  }

  updateBinSlide() {
    if(this.control.fusionStatus < 13){
      this.remoteControlService.showNotConnectedToast();
      return;
    }
    this.activeRequest = true;

    this.remoteControlService.sendChanges(this.entity.deviceSerialNumber, 0, this.activeId, RemoteControlCommandType.ManualDeviceControl, this.control.fusionFeatureVersion)
  }

  getVariableSliderTop() {
    if (this.platform.is('ios')) return ((100 - this.value) / 100 * 32.5) + 30.5 + '%'
    else return ((100 - this.value) / 100 * 31.5) + 32 + '%'
  }


}
