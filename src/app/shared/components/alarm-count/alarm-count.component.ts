import { Component, Input, OnInit } from '@angular/core';
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';

@Component({
  selector: 'alarm-count',
  templateUrl: './alarm-count.component.html',
  styleUrls: ['./alarm-count.component.scss'],
  standalone: false
})
export class AlarmCountComponent  implements OnInit {

  @Input('orgId') orgId?: number;

  constructor(
    public alarmData: AlarmDataProvider
  ) { }

  ngOnInit() {
    if(!this.orgId) this.alarmData.getMinimalAlarms();
  }

}
