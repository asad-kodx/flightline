import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { AlertDataProvider } from 'src/app/core/providers/alert-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { OfflineAlert } from 'src/app/shared/models';
import { IgnoredControlsPage } from '../ignored-controls/ignored-controls.page';


@Component({
  selector: 'app-offline-alerts',
  templateUrl: './offline-alerts.page.html',
  styleUrls: ['./offline-alerts.page.scss'],
  standalone: false,
})
export class OfflineAlertsPage implements OnInit {
  public offlineAlerts!: Observable<OfflineAlert[]>;
  public selected: string = 'offline';
  public searchInput: string = '';
  public pullMax = window.innerHeight * 0.7;
  public pullMin = window.innerHeight * 0.12;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private auth: AuthService,
    protected controlData: ControlDataProvider,
    private alertsData: AlertDataProvider
  ) {}
  ngOnInit() {
    this.offlineAlerts = this.alertsData.setupOfflineAlertsBinding();
    this.alertsData.getOfflineAlerts(localStorage.getItem('user_id') || '');
  }

  itemTapped(offlineAlert: OfflineAlert) {
    this.navCtrl.navigateForward('offline-alert-details', {
      queryParams: { offlineAlert: offlineAlert },
    });
  }

  public onSearchInput(event: any) {
    this.offlineAlerts = this.alertsData
      .setupOfflineAlertsBinding()
      .pipe(
        map((alerts: any) =>
          alerts.filter(
            (a: any) =>
              a.name.includes(this.searchInput) ||
              a.serialNumber.toString().includes(this.searchInput)
          )
        )
      );
  }

  async openIgnoredControlsModal() {
    const modal = await this.modalCtrl.create({
      component: IgnoredControlsPage,
    });
    await modal.present();
  }

  public handleRefresh(event: any) {
    this.alertsData.getOfflineAlerts(localStorage.getItem('user_id') || '');
    this.offlineAlerts.subscribe(() => {
      window.setTimeout(() => event.complete(), 500);
    });
  }

  public handleKeyUp(event: any) {
    if (event.keyCode == 13) {
      // this.keyboard.close();
    }
  }

  public closeKeyboard() {
    // this.keyboard.close();
  }
}
