import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
// import { NavParams } from '@ionic/angular';
import { Subscription, Observable, timer, switchMap } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import { Control } from 'src/app/shared/models';

@Component({
  selector: 'app-control-detail-tabs',
  templateUrl: './control-detail-tabs.page.html',
  styleUrls: ['./control-detail-tabs.page.scss'],
  standalone: false
})
export class ControlDetailTabsPage implements OnInit {
  public control?: Control;

  tabSelectedIndex: number;
  tab1Root: any = 'tabs-sensor-list-page';
  tab2Root: any = 'tabs-device-list-page';
  tab3Root: any = 'alarms-list-tabs';
  private timer: Subscription;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private navCtrl: NavController,
    private liveValuesSub: LiveValuesSubscription,
    public alarmData: AlarmDataProvider,
    private controlData: ControlDataProvider
  ) {
    this.tabSelectedIndex = 0;
    this.timer = timer(0, 10000)
      .pipe(
        switchMap(() =>
          this.liveValuesSub.requestLiveValuesForControl(
            this.control?.serialNumber || ''
          )
        )
      )
      .subscribe();
  }

  ngOnInit() {
    // const state = this.router.currentNavigation()?.extras.state as any;
    this.control = this.controlData.getSelectedControl()
    console.log('Control', this.control);
    
  }

  onTab(tabName: string) {
    if (this.control && this.control.serialNumber) this.notify.emit(tabName);
  }
  ngOnDestroy() {
    this.timer.unsubscribe();
  }
}
