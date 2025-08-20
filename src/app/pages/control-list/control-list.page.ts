import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
    private controlData: ControlDataProvider, private router: Router, private navCtrl: NavController, public alarmData: AlarmDataProvider, private siteContext: SiteContextService
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
      this.navCtrl.navigateForward(['/control-details/control-detail-tabs'], {state: { control: control }});
  }


  handleRefresh(event: any) {
      var sub = this.getControlData().subscribe({
        next: (unused) => {
          console.log("Control List refresh sub")
          window.setTimeout(() => event.complete(), 500)
          // sub.unsubscribe();
        },
        error: error => { }
      });
  }


  public toggleFavorite(control: Control) {
    console.log("toggling favorite")
    this.controlData.toggleFavoriteControl(control.serialNumber!, !control.isFavorite).subscribe(() => {
        // window.setTimeout(() => this.controls = this.getControlData(), 10);
        this.controls = this.controlData.updateControls();
    });
  }


  hasFavorites(val: string, controls: Control[] | null){
      if(!controls) return false;
      switch(val){
          case "all":
              return controls.filter(ctrl => ctrl.isFavorite).length > 0;
          case "online":
              return controls.filter(ctrl => ctrl.isFavorite && ctrl.status == 0).length > 0;
          case "offline":
              return controls.filter(ctrl => ctrl.isFavorite && ctrl.status != 0).length > 0;
          default: return false;
      }
  }

  hasNormal(val: string, controls: Control[] | null){
      if(!controls) return false;
      switch(val){
          case "all":
              return controls.filter(ctrl => !ctrl.isFavorite).length > 0;
          case "online":
              return controls.filter(ctrl => !ctrl.isFavorite && ctrl.status == 0).length > 0;
          case "offline":
              return controls.filter(ctrl => !ctrl.isFavorite && ctrl.status != 0).length > 0;
          default: return false;
      }
  }


  isFavorite(control: Control){
      if(control.isFavorite) return 'star';
      return 'star-outline';
  }
}
