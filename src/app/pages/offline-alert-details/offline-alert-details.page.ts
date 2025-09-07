import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AlertDataProvider } from 'src/app/core/providers/alert-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { OfflineAlert } from 'src/app/shared/models';

@Component({
  selector: 'app-offline-alert-details',
  templateUrl: './offline-alert-details.page.html',
  styleUrls: ['./offline-alert-details.page.scss'],
  standalone: false
})
export class OfflineAlertDetailsPage implements OnInit {

    public offlineAlert: OfflineAlert;
    public offlineAlertId!: number;
    private sub: any;

    constructor(public navParams: NavParams, protected alertData: AlertDataProvider, protected controlData: ControlDataProvider, private nav: NavController, protected authService: AuthService, private auth: AuthService) {
        this.offlineAlert = this.navParams.get('offlineAlert');
        console.log(this.offlineAlert)
    }
    ngOnInit() {
      console.debug('Offline Alert', this.offlineAlert);
      // this.events.subscribe('AlertSwitch', (alert: OfflineAlert) => {
      //     this.offlineAlert = alert;
      // })
    }
    ionViewWillLeave() {
        if (this.sub) this.sub.unsubscribe();
    }

    public clearOfflineAlert(offlineAlert: OfflineAlert) {
        this.offlineAlert.isActive = false;
        const alertSerialNumber = offlineAlert.serialNumber;
        const userId = localStorage.getItem('user_id');
        // Pass the cleared alert to the provider so it can emit the observable
        this.alertData.clearOfflineAlert(alertSerialNumber, userId, offlineAlert);
        this.nav.pop();
    }

}
