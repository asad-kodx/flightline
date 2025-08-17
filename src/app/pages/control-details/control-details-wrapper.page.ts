import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Control } from 'src/app/shared/models';

@Component({
  selector: 'app-control-details-wrapper',
  templateUrl: './control-details-wrapper.page.html',
  styleUrls: ['./control-details-wrapper.page.scss'],
  standalone: false
})
export class ControlDetailsWrapperPage {

    protected tabTitle: string = '';
    protected control: Control;

    constructor(public navCtrl: NavController, public navParams: NavParams){
        console.log('Wrapper', this.navParams);
        this.control = this.navParams.get('control');
    }

    onTabChange(tabTitle: string){
        this.tabTitle = tabTitle;
    }

}
