import { Injectable } from '@angular/core';;
import { BehaviorSubject, Observable } from 'rxjs';
import { SignalRService } from './signalr.service';
import { timer } from 'rxjs/observable/timer';
import { ControlDataProvider } from '../providers/control-data.provider';

@Injectable()
export class LiveValueService {

    private liveValuesMap: Map<string, {}>;
    private $liveValues: BehaviorSubject<Map<string, {}>>;
    public liveValues: Observable<Map<string, {}>>;
   


    constructor(private signalRService: SignalRService, private controlData: ControlDataProvider) {
        this.liveValuesMap = new Map<string, {}>();
        this.$liveValues = new BehaviorSubject<Map<string, {}>>(new Map<string, {}>());
        this.liveValues = this.$liveValues.asObservable();
       

        this.signalRService.liveValueMessageReceived$.subscribe(lvData => {
            lvData.data.forEach(lv => {
                this.setLiveValues(lv);
            });
        });

        this.signalRService.sendExtendedRoomData.subscribe(lvData => {
            this.setExtendedLiveValues(lvData)
        })
    }

    protected expireOldValues(){
       //TODO:  Setup old value expiration
    }

    public getLiveValuesBinding(){
        return this.liveValues; 
    }

    public setLiveValues(data){
        this.liveValuesMap.set(data.key, data);
        this.$liveValues.next(this.liveValuesMap);
    }

    public setExtendedLiveValues(data){
        data.dayTemperatureHistory.setTemperature = this.convertTemperature(Number(data.dayTemperatureHistory.setTemperature), data.serialNumber);
        data.dayTemperatureHistory.roomTemperature = this.convertTemperature(Number(data.dayTemperatureHistory.roomTemperature), data.serialNumber);
        this.liveValuesMap.set(data.serialNumber + '.' + data.roomIndex, data);
        this.$liveValues.next(this.liveValuesMap);
    }

    convertTemperature(value, serialNumber){
        var control = this.controlData.getControl(Number(serialNumber));
        if(!control) return value.toFixed(1) + ' °F';
        if(value == 0) return '--'
        if(control.temperatureUnits == "Celsius") return ((value -32) * (5/9)).toFixed(1) + ' °C';
        else return value.toFixed(1) + ' °F';
    }


    public getLiveValueItemBinding(hardwareString: string) : Observable<any> {
        return this.liveValues.switchMap((lvData) => {
            return lvData[hardwareString];
        });
    }
}