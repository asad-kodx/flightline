import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Control } from 'src/app/shared/models';

@Component({
  selector: 'app-control-details-wrapper',
  templateUrl: './control-details-wrapper.page.html',
  styleUrls: ['./control-details-wrapper.page.scss'],
  standalone: false
})
export class ControlDetailsWrapperPage {

    protected tabTitle: string = '';
    protected control!: Control;

    constructor(public navCtrl: NavController, private route: ActivatedRoute){
        // console.log('Wrapper', this.navParams);
        // this.control = this.navParams.get('control');
        this.route.queryParams.subscribe((params) => {
            this.control = params['control'];
        });
    }

    onTabChange(tabTitle: string){
        this.tabTitle = tabTitle;
    }

}
