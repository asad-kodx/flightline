import { Pipe, PipeTransform } from '@angular/core';
import { Control, DeviceType, SensorType } from '../../models';

@Pipe({
  name: 'LiveValueDisplay',
  standalone: false
})
export class LiveValueDisplayPipe implements PipeTransform {

  transform(value: number | null | undefined, args: any[] | null | undefined): string {
        if (value == null || !args || args.length < 2) {
            return '--';
        }
        
        const type = args[0];
        
        if (type === 'sensor') {
            return this.transformSensorValue(value, args[1], args[2], args[3]);
        } else {
            return this.transformDeviceValue(value, args[1], args[2]);
        }
    }
    
    private transformSensorValue(value: number, sensorType: SensorType, control?: Control, label?: string): string {
        switch (sensorType) {
            case SensorType.AbstractSensor:
            case SensorType.Humidity:
                return value.toFixed(2) + ' %';
            case SensorType.Oxygen:
            case SensorType.Pressure:
            case SensorType.StaticPressure:
                if (control?.pressureUnits === 'Pascals') {
                    return (value * 248.84).toFixed(1) + ' Pa';
                }
                return value + '\'';
            case SensorType.WaterLevel:
                return value + (label ? ' ' + label : '');
            case SensorType.Switch:
            case SensorType.Whisker:
                return value === 1 ? 'On' : 'Off';
            case SensorType.WaterMeter:
                return value.toFixed(1) + ' gpm';
            case SensorType.Bin:
            case SensorType.Weight:
                if (!control) return value.toString();
                if (control.massUnits === 'Pounds' || !control.massUnits) {
                    return (value * 0.00220462).toFixed(0) + ' lbs';
                }
                return (value / 1000).toFixed(1) + ' kg';
            case SensorType.Temperature:
                if (!control) return value.toString();
                if (control.temperatureUnits === 'Fahrenheit' || !control.temperatureUnits) {
                    return (((value * 9) / 5) + 32).toFixed(1) + '° F';
                }
                return value.toFixed(1) + '° C';
            case SensorType.WindDirection:
                return this.getWindDirection(value);
            case SensorType.WindSpeed:
                return value + ' mph';
            case SensorType.Ammonia:
            case SensorType.CO2:
            case SensorType.CO:
            case SensorType.PPM:
                return value + ' PPM';
            case SensorType.PressureGuage:
                return value + ' PSI';
            case SensorType.Current:
                return value + ' Amps';
            case SensorType.VoltageSensor:
                return value + ' V';
            case SensorType.RainPrecipitationSensor:
                if (!control) return value.toString();
                if (control.lengthUnits === 'Inches') {
                    return (value * 0.039370).toFixed(2) + ' in/h';
                }
                return value + ' mm/h';
            case SensorType.ElectricMeterSensor:
                return value + ' kWh';
            case SensorType.GasMeterSensor:
                return value + ' Ft³/Min';
            case SensorType.PH:
                return value.toFixed(2);
            case SensorType.EC:
                return value + (label ? ' ' + label : '');
            case SensorType.ORP:
                return value + ' mV';
            case SensorType.Moisture:
                return value.toFixed(1) + ' %';
            default:
                return value.toString();
        }
    }
    
    private transformDeviceValue(value: number, deviceType: DeviceType, control?: Control): string {
        switch (deviceType) {
            case DeviceType.DualRelayCardBooleanFanDevice:
            case DeviceType.OctoRelayCardBooleanFanDevice:
            case DeviceType.DualRelayCardBooleanFoggerDevice:
            case DeviceType.QuadRelayCardBooleanFanDevice:
            case DeviceType.QuadRelayCardBooleanFoggerDevice:
            case DeviceType.QuadRelayCardBooleanHeaterDevice:
            case DeviceType.QuadRelayCardBooleanMotorDevice:
            case DeviceType.DualRelayCardBooleanMotorDevice:
            case DeviceType.BooleanRelayMotorDevice:
            case DeviceType.BooleanRelayHeaterDevice:
            case DeviceType.BooleanRelayFoggerDevice:
            case DeviceType.BooleanRelayFanDevice:
            case DeviceType.DualRelayCardBooleanHeaterDevice:
            case DeviceType.OctoRelayCardBooleanHeaterDevice:
            case DeviceType.CycleTimerDevice:
            case DeviceType.PercentCycleTimerDevice:
            case DeviceType.SwitchDevice:
            case DeviceType.DayTimerDevice:
            case DeviceType.ChainDiskDevice:
            case DeviceType.AlarmDevice:
            case DeviceType.ClockDevice:
            case DeviceType.GenericProcessDevice:
            case DeviceType.BallDropDevice:
            case DeviceType.GenericBooleanMotorDevice:
            case DeviceType.BooleanDoserDevice:
            case DeviceType.BooleanValveDevice:
            case DeviceType.MixingProcessDevice:
            case DeviceType.BatchTankProcessDevice:
                return value === 1 ? 'On' : 'Off';
            case DeviceType.VariableCardVariableFanDevice:
            case DeviceType.VariableCurrentCardVariableHeaterDevice:
            case DeviceType.VariableCurrentCardVariableFanDevice:
            case DeviceType.VariableCardHeatLampDevice:
            case DeviceType.LightDevice:
            case DeviceType.SlideDevice:
            case DeviceType.VariableDoserDevice:
                return value.toFixed(1) + ' %';
            case DeviceType.FanGroupDevice:
                return value.toFixed(1) + ' CFM';
            case DeviceType.CurtainCardCurtainDevice:
            case DeviceType.CurtainDeviceV2:
                if (!control) {
                    return (value / 25.4).toFixed(1) + ' in';
                }
                const version = control.version?.split('.');
                if (version && version.length > 2 && Number(version[2]) >= 71) {
                    return value.toFixed(1) + ' %';
                }
                return (value / 25.4).toFixed(1) + ' in';
            case DeviceType.BinSlideDevice:
                return '- -';
            default:
                return value.toString();
        }
    }
    
    private getWindDirection(value: number): string {
        if (value > 337.5 || value <= 22.5) return 'N';
        if (value > 22.5 && value <= 67.5) return 'NE';
        if (value > 67.5 && value <= 112.5) return 'E';
        if (value > 112.5 && value <= 157.5) return 'SE';
        if (value > 157.5 && value <= 202.5) return 'S';
        if (value > 202.5 && value <= 247.5) return 'SW';
        if (value > 247.5 && value <= 292.5) return 'W';
        if (value > 292.5 && value <= 337.5) return 'NW';
        return value.toString();
    }

}
