import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { SiteContextService } from 'src/app/core/services/site-context.service';
import { Control } from 'src/app/shared/models';

@Component({
  selector: 'app-control-list',
  templateUrl: './control-list.page.html',
  styleUrls: ['./control-list.page.scss'],
  standalone: false,
})
export class ControlListPage implements OnInit {
  public controls!: Observable<Control[]>;
  public searchText: string = '';
  searchControl: FormControl = new FormControl();

  public segmentSelected: any = "all";
  public pullMax = window.innerHeight * .7
  public pullMin = window.innerHeight * .12

  constructor(
    private controlData: ControlDataProvider, private navCtrl: NavController, public alarmData: AlarmDataProvider, private siteContext: SiteContextService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
      this.getControlData();
  }

  getControlData() {
      this.controls = this.controlData.getControlsBinding();
      this.controlData.getControls<Control[]>();
      return this.controls;
  }

  navigateToDetails(control: Control) {
      this.navCtrl.navigateForward('control-details-tabs', {state: { control: control }});
  }


  public toggleFavorite(control: Control) {
    console.log("toggling favorite")
    this.controlData.toggleFavoriteControl(control.serialNumber!, !control.isFavorite).subscribe(() => {
        // window.setTimeout(() => this.controls = this.getControlData(), 10);
        this.controls = this.controlData.updateControls();
    });
  }
}
