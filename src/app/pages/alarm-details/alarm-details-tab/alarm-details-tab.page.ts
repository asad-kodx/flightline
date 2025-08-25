import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavParams, Platform } from '@ionic/angular';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import { ControlAlarm } from 'src/app/shared/models';

@Component({
  selector: 'app-alarm-details-tab',
  templateUrl: './alarm-details-tab.page.html',
  styleUrls: ['./alarm-details-tab.page.scss'],
  standalone: false,
})
export class AlarmDetailsTabPage implements OnInit {
  @Input('alarm') alarm: ControlAlarm;
  @ViewChild('alarmTabs') alarmTabs: any;

  public nav: any;
  tabSelectedIndex: number;
  tab1: any = 'alarm-actions-page';
  tab2: any = 'alarm-history-page'; // 'tabs-alarm-asignments-page';
  tab3: any = 'alarm-group-members-page'; // 'remote-control-page';

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    navParams: NavParams,
    private alarmData: AlarmDataProvider,
    private liveValues: LiveValuesSubscription,
    // private events: Events,
    private platform: Platform
  ) {
    this.alarm = <ControlAlarm>navParams.get('alarm');
    this.nav = navParams.get('nav');
    this.tabSelectedIndex = navParams.data['tabIndex'] || 0;
  }
  ngOnInit() {
    this.liveValues
      .requestLiveValuesList([this.alarm.entityHardwareId!])
      .subscribe();
    // this.events.subscribe('AlarmSwitch', (alarm) => {
    //   if (this.alarm.fusionAlarmKey != alarm.fusionAlarmKey) {
    //     this.alarm = alarm;
    //   }
    // });
  }

  ionViewWillUnload() {
    // this.events.unsubscribe('AlarmSwitch');
  }

  onTab(tabName: string) {
    this.notify.emit(tabName);
  }

  pushUp() {
    if (this.nav && this.platform.is('ios')) return 'pushUpIos';
    if (this.nav && this.platform.is('android')) return 'pushUpAndroid';
    return null;
  }
}
