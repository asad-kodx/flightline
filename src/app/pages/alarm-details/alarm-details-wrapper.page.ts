import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-alarm-details-wrapper',
  templateUrl: './alarm-details-wrapper.page.html',
  styleUrls: ['./alarm-details-wrapper.page.scss'],
  standalone: false,
})
export class AlarmDetailsWrapperPage implements OnInit {
  ngOnInit() {}
  protected tabTitle: string = '';
  protected alarm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log('Wrapper', this.navParams);
    this.alarm = this.navParams.get('alarm');
  }

  onTabChange(tabTitle: string) {
    this.tabTitle = tabTitle;
  }
}
