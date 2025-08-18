import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Subscription, Observable, timer, switchMap } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';

@Component({
  selector: 'app-control-detail-tabs',
  templateUrl: './control-detail-tabs.page.html',
  styleUrls: ['./control-detail-tabs.page.scss'],
  standalone: false
})
export class ControlDetailTabsPage {
  @Input('control') control: any;

  tabSelectedIndex: number;
  tab1Root: any = 'tabs-sensor-list-page';
  tab2Root: any = 'tabs-device-list-page';
  tab3Root: any = 'alarms-list-tabs';
  private timer: Subscription;
  public nav: any;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private navParams: NavParams,
    private liveValuesSub: LiveValuesSubscription,
    public alarmData: AlarmDataProvider
  ) {
    this.control = this.navParams.get('control');
    this.nav = this.navParams.get('nav');
    this.tabSelectedIndex = navParams.data['tabIndex'] || 0;
    this.timer = timer(0, 10000)
      .pipe(
        switchMap(() =>
          this.liveValuesSub.requestLiveValuesForControl(
            this.control.serialNumber
          )
        )
      )
      .subscribe();
  }

  onTab(tabName: string) {
    if (this.control && this.control.serialNumber) this.notify.emit(tabName);
  }
  ngOnDestroy() {
    this.timer.unsubscribe();
  }
}
