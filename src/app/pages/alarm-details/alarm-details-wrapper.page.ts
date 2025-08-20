import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) {
    // console.log('Wrapper', this.navParams);
    // this.alarm = this.navParams.get('alarm');
    this.route.queryParams.subscribe((params) => {
      this.alarm = params['alarm'];
    });
  }

  onTabChange(tabTitle: string) {
    this.tabTitle = tabTitle;
  }
}
