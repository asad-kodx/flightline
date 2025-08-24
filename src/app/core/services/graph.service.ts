import { Injectable, EventEmitter } from '@angular/core';;
import { SignalRService } from './signalr.service';
import { LiveValuesSubscription } from '../providers/livevalues-subscription.provider';
import * as moment from 'moment';

import { Control, Sensor, SensorType } from "../../shared/models/index";

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    public liveHistoryReceived: EventEmitter<any>;

    constructor(private liveValueSubscription: LiveValuesSubscription, private signalrService: SignalRService) {
        this.liveHistoryReceived = new EventEmitter<any>();
        this.signalrService.liveHistoryReceived$.subscribe((data) => {
            this.liveHistoryReceived.emit(data);
        })
    }

    public requestLiveHistory(property: string, hardwareId: string) {
        var split = hardwareId.split('.');
        var controlSerialNumber = split[0];
        var cardIndex = split[1];
        var slotIndex = split[2];
        var endTime = moment().toDate();
        var startTime = moment().subtract(24, 'hours').toDate();
        this.liveValueSubscription.requestLiveHistory(controlSerialNumber, cardIndex, slotIndex, startTime, endTime, property).subscribe();
    }



    public convertGraphData(entity: Sensor, data: any, control: Control) {
        console.log(control)
        var values = [];
        if (entity.sensorType == SensorType.Temperature) {
            var v1 = Number(data.liveValueHistory[0].x.toFixed(1));
            if(control.temperatureUnits == "Fahrenheit") v1 =  Number((data.liveValueHistory[0].x * 1.8 + 32).toFixed(1));
            values.push({ name: new Date(moment().subtract(1, "days").toDate()), value: v1 })
        }
        else if (entity.sensorType == SensorType.Bin || entity.sensorType == SensorType.Weight) {
            var v2 = Number((data.liveValueHistory[0].x / 1000).toFixed(1));
            if(control.massUnits == "Pounds") v2 =  Number((data.liveValueHistory[0].x * 0.00220462).toFixed(0));
            values.push({ name: new Date(moment().subtract(1, "days").toDate()), value:v2 });
        }
        else if (entity.sensorType == SensorType.WaterMeter) {
            values.push({ name: new Date(moment().subtract(1, "days").toDate()), value: (data.liveValueHistory[0].x * 0.264172).toFixed(1) });
        }
        else if (entity.sensorType == SensorType.WindSpeed) {
            values.push({ name: new Date(moment().subtract(1, "days").toDate()), value: Number((data.liveValueHistory[0].x * 2.23694).toFixed(2)) })
        }
        else {
            values.push({ name: new Date(moment().subtract(1, "days").toDate()), value: data.liveValueHistory[0].x });
        }
        data.liveValueHistory.forEach((point: any) => {
            if (entity.sensorType == SensorType.Temperature) {
                var v3 = Number(point.x.toFixed(1));
                if(control.temperatureUnits == "Fahrenheit") v3 =  Number((point.x * 1.8 + 32).toFixed(1));
                values.push({ name: new Date(Number(point.y)), value: v3 })
            }
            else if (entity.sensorType == SensorType.Bin) {
                var v4 = Number((data.point / 1000).toFixed(1));
                if(control.massUnits == "Pounds") v4 =  Number((point.x * 0.00220462).toFixed(0));
                values.push({ name: new Date(Number(point.y)), value: v4 });
            }
            else if (entity.sensorType == SensorType.WaterMeter) {
                values.push({ name: new Date(Number(point.y)), value: (point.x * 0.264172).toFixed(1) });
            }
            else if (entity.sensorType == SensorType.WindSpeed) {
                values.push({ name: new Date(Number(point.y)), value: Number((point.x * 2.23694).toFixed(2)) })
            }
            else {
                values.push({ name: new Date(Number(point.y)), value: point.x });
            }
        });

        return values;
    }

    public getMinMax(data: any, minRange: any) {
        var yValues: any = [];
        data.liveValueHistory.forEach((point: any) => {
            yValues.push(point.x)
        })
        var max = Math.max.apply(null, yValues);
        var min = Math.min.apply(null, yValues);
        if ((min == 0 && max == 0) || (min == 0 && max == 1) || (min == 1 && max == 1)) {
            min = 0;
            max = 1;
        }
        else {
            var range = max - min;
            console.log(min, max, range)
            if (range < minRange) range = minRange;
            min = Math.round(min - range * .3);
            max = Math.round(max + range * .3);
        }

        return { min: min, max: max }
    }

    public getSensorProperty(entity: Sensor): any {
        var minRange = 1;
        if (entity.sensorType == SensorType.Temperature) {
            minRange = 10
            return { minRange: minRange, property: 'temperature' };
        }
        if (entity.sensorType == SensorType.Bin) {
            minRange = 100;
            return { minRange: minRange, property: 'mass' };
        }
        if (entity.sensorType == SensorType.Humidity) {
            minRange = 10;
            return { minRange: minRange, property: 'humidity' };
        }
        if (entity.sensorType == SensorType.Oxygen) {
            return { minRange: minRange, property: 'oxygen' };
        }
        if (entity.sensorType == SensorType.Pressure) {
            return { minRange: minRange, property: 'pressure' };
        }
        if (entity.sensorType == SensorType.Switch) {
            minRange = 0;
            return { minRange: minRange, property: 'switchState' };
        }
        if (entity.sensorType == SensorType.WaterMeter) {
            return { minRange: minRange, property: 'volumeRate' };
        }
        if (entity.sensorType == SensorType.Whisker) {
            return { minRange: minRange, property: 'switchState' };
        }
        if (entity.sensorType == SensorType.Current) {
            return { minRange: minRange, property: 'current' };
        }
        if (entity.sensorType == SensorType.Ammonia) {
            return { minRange: minRange, property: 'ammonia' };
        }
        if (entity.sensorType == SensorType.CO2) {
            return { minRange: minRange, property: 'co2' };
        }
        if (entity.sensorType == SensorType.WaterLevel) {
            return { minRange: minRange, property: 'water level' };
        }
        if (entity.sensorType == SensorType.PressureGuage) {
            return { minRange: minRange, property: 'pressure gauge' };
        }
        if (entity.sensorType == SensorType.WindSpeed) {
            return { minRange: minRange, property: 'windspeed' };
        }
        if (entity.sensorType == SensorType.WindDirection) {
            return { minRange: minRange, property: 'winddirection' }
        }
        if (entity.sensorType == SensorType.CO) {
            return { minRange: minRange, property: 'co' };
        }
        if (entity.sensorType == SensorType.VoltageSensor) {
            return { minRange: minRange, property: 'voltage' };
        }
        if (entity.sensorType == SensorType.RainPrecipitationSensor) {
            return { minRange: minRange, property: 'precipitation' };
        }
        if (entity.sensorType == SensorType.ElectricMeterSensor) {
            return { minRange: minRange, property: 'power' };
        }
        if (entity.sensorType == SensorType.GasMeterSensor) {
            return { minRange: minRange, property: 'volumerate' }
        }
        if (entity.sensorType == SensorType.Moisture) {
            return { minRange: minRange, property: 'moisture' };
        }
        if (entity.sensorType == SensorType.EC) {
            return { minRange: minRange, property: 'ec' };
        }
        if (entity.sensorType == SensorType.PH) {
            return { minRange: minRange, property: 'ph' };
        }
        if (entity.sensorType == SensorType.ORP){
            return { minRange: minRange, property: 'orp' };
        }
        if (entity.sensorType == SensorType.Weight){
            return { minRange: minRange, property: 'weight' };
        }
        if (entity.sensorType == SensorType.PPM){
            return { minRange: minRange, property: 'ppm' };
        }
        else return null;
    }
}