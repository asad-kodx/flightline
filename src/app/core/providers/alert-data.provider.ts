import * as _ from 'lodash';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { OfflineAlert } from 'src/app/shared/models';
import { ConfigurationService } from '../services/configuration.service';
import { HttpService } from '../services/http-service';

export class AlertDataProvider {
  private config = ConfigurationService;

  public offlineAlerts: Observable<OfflineAlert[]>;
  private _offlineAlerts: BehaviorSubject<OfflineAlert[]>;

  private offlineAlertStore: {
    offlineAlerts: OfflineAlert[];
  };

  constructor(private httpService: HttpService) {
    // this.events.subscribe('Logout', () => {
    //     this._offlineAlerts.next(Object.assign({}, this.offlineAlertStore).offlineAlerts);
    // });

    // this.events.subscribe('OfflineAlertCleared', (clearedAlert: OfflineAlert) => {
    //     var foundAlert = this.offlineAlertStore.offlineAlerts.findIndex(oa => oa.serialNumber == clearedAlert.serialNumber);
    //     this.offlineAlertStore.offlineAlerts.splice(foundAlert, 1);
    //     this._offlineAlerts.next(Object.assign({}, this.offlineAlertStore).offlineAlerts);
    // });

    this.offlineAlertStore = { offlineAlerts: [] };
    this._offlineAlerts = new BehaviorSubject<OfflineAlert[]>([]);
    this.offlineAlerts = this._offlineAlerts.asObservable();
  }

  setupOfflineAlertsBinding(): Observable<OfflineAlert[]> {
    return this.offlineAlerts;
  }

  getOfflineAlerts(userId: string) {
    this.getOfflineAlertsFromServer(userId);
  }

  private getOfflineAlertsFromServer(userId: string) {
    return this.httpService
      .get(`${this.config.baseUrl}/api/mobile/alerts/${userId}/offlinealerts`)
      .subscribe({
        next: (data: any) => {
          data = _.sortBy(data, ['offlineTime']).reverse();
          this.offlineAlertStore.offlineAlerts = data;
          this._offlineAlerts.next(
            Object.assign({}, this.offlineAlertStore).offlineAlerts
          );
        },
        error: (error) => this.handleError(error)
      });
  }

  clearOfflineAlert(serialNumber: number, userId: string | null) {
    return this.httpService
      .post(
        `${this.config.baseUrl}/api/mobile/alerts/${userId}/offlinealerts/clear/${serialNumber}`,
        null
      )
      .subscribe(
        () => {},
        (error) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    console.warn('Error In Observable', error);
    return of(null);
  }
}
