import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { LiveValuesSubscription } from 'src/app/core/providers/livevalues-subscription.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';
import { GraphService } from 'src/app/core/services/graph.service';
import { LiveValueService } from 'src/app/core/services/live-value.service';
import { Sensor, Device, Control } from 'src/app/shared/models';

@Component({
  selector: 'app-entity-graphs',
  templateUrl: './entity-graphs.page.html',
  styleUrls: ['./entity-graphs.page.scss'],
  standalone: false,
})
export class EntityGraphsPage implements OnInit {
  public entity: Sensor & Device;
  public graphData: any;
  protected liveValuesMap?: Observable<Map<string, any>>;
  private width: number = window.innerWidth;
  private height: number = window.innerHeight - 300;
  public control!: Control;
  public typeData: any;
  view: [number, number] = [this.width, this.height];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Value';
  yScaleMax = 1;
  yScaleMin = 0;
  xAxisTicks = [
    new Date(moment().subtract(24, 'hours').toDate()),
    new Date(moment().subtract(18, 'hours').toDate()),
    new Date(moment().subtract(12, 'hours').toDate()),
    new Date(moment().subtract(6, 'hours').toDate()),
    new Date(moment().toDate()),
  ];

  xAxisTickFormatting = (value: any) => value.toLocaleTimeString();
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  // line, area
  autoScale = true;

  constructor(
    private navParams: NavParams,
    private liveValuesService: LiveValueService,
    private lvSub: LiveValuesSubscription,
    private graphService: GraphService,
    private controlData: ControlDataProvider,
    private navCtrl: NavController,
    private roomData: RoomDataProvider
  ) {
    this.entity = this.navParams.data['data'];
    if (this.entity.entitySerialNumber) {
      console.log('pulling entity');
      this.entity = this.roomData.getEntity(this.entity.entitySerialNumber)!;
      console.log('new entity', this.entity);
    }
    this.graphData = [
      {
        name: this.entity.sensorName,
        series: [],
      },
    ];
    this.liveValuesMap = this.liveValuesService.getLiveValuesBinding();
  }

  xAxisFormat(val: Date) {
    return val.toLocaleTimeString();
  }

  ngOnInit() {
    this.control = this.controlData.getControl(
      this.entity.controlSerialNumber
    )!;

    this.typeData = this.graphService.getSensorProperty(this.entity);
    if (!this.typeData) return;
    this.graphService.liveHistoryReceived.subscribe((data) => {
      if (data.liveValueHistory.length == 0) return;
      console.log('graphs data', data);
      var values = this.graphService.convertGraphData(
        this.entity,
        data,
        this.control
      );
      var minMax = this.graphService.getMinMax(data, this.typeData.minRange);

      if (this.typeData.property == 'temperature') {
        minMax.min = Number((minMax.min * 1.8 + 32).toFixed(1));
        minMax.max = Number((minMax.max * 1.8 + 32).toFixed(1));
      } else if (this.typeData.property == 'mass') {
        minMax.min = Number((minMax.min * 0.00220462).toFixed(0));
        minMax.max = Number((minMax.max * 0.00220462).toFixed(0));
      } else if (this.typeData.property == 'volumeRate') {
        minMax.min = Number((minMax.min * 0.264172).toFixed(1));
        minMax.max = Number((minMax.max * 0.264172).toFixed(1));
      } else if (this.typeData.property == 'windspeed') {
        minMax.min = Number((minMax.min * 2.23694).toFixed(2));
        minMax.max = Number((minMax.max * 2.23694).toFixed(2));
      }
      this.autoScale = false;
      this.yScaleMin = minMax.min;
      this.yScaleMax = minMax.max;
      console.log('Min/Max', minMax);
      this.graphData = [
        {
          name: this.entity.sensorName,
          series: values,
        },
      ];

      console.log(this.graphData);
    });
    this.graphService.requestLiveHistory(
      this.typeData.property,
      this.entity.sensorSerialNumber
    );
  }

  ionViewWillEnter() {
    // this.events.subscribe('AlarmControlTabs', (alarm: any) => {
    //     this.navCtrl.navigateForward('alarm-details-tabs', { queryParams: {alarm: alarm, nav: this.navCtrl} });
    // })
  }

  ionViewWillLeave() {
    // this.events.unsubscribe('AlarmControlTabs')
  }
}
