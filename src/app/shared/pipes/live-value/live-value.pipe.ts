import { Pipe, PipeTransform } from '@angular/core';
import { Control, DeviceType, SensorType } from '../../models';

@Pipe({
  name: 'LiveValueDisplay',
  standalone: false
})
export class LiveValueDisplayPipe implements PipeTransform {

  transform(value: number, args: any[]) {
        if (value == null) return null;
        if (value !== undefined) {
            var type = args[0];
            if (type == 'sensor') {
                var sensorType: SensorType = args[1];
                let control = (<Control>args[2])
                switch (sensorType) {

                    case SensorType.AbstractSensor:
                    case SensorType.Humidity:
                        return (value * 1).toFixed(2) + " %";
                    case SensorType.Oxygen:
                    case SensorType.Pressure:
                    case SensorType.StaticPressure:
                        if (control) {
                            if (control.pressureUnits == "Pascals") return (value * 248.84).toFixed(1) + " Pa"
                            else return value + "'"
                        }
                        else {
                            return value + "'"
                        }
                    case SensorType.WaterLevel:
                        return (value) + ' ' + args[3];
                    case SensorType.Switch:
                        return (value == 1) ? "On" : "Off";
                    case SensorType.WaterMeter:
                        return (value * 1).toFixed(1) + " gpm";
                    case SensorType.Whisker:
                        return (value == 1) ? "On" : "Off";
                    case SensorType.Bin:
                    case SensorType.Weight:
                        if (!control) return;
                        if (control.massUnits == "Pounds" || !control.massUnits) return (value * 0.00220462).toFixed(0) + " lbs"
                        else return value / 1000 + " kg"
                    case SensorType.Temperature:
                        if (!control) return;
                        if (control.temperatureUnits == "Fahrenheit" || !control.temperatureUnits) return (((value * 9) / 5) + 32).toFixed(1) + "° F";
                        else return value + "° C";
                    case SensorType.WindDirection:
                        if (value > 337.5 || value <= 22.5) return 'N';
                        else if (value > 22.5 && value <= 67.5) return 'NE';
                        else if (value > 67.5 && value <= 112.5) return 'E';
                        else if (value > 112.5 && value <= 157.5) return 'SE';
                        else if (value > 157.5 && value <= 202.5) return 'S';
                        else if (value > 202.5 && value <= 247.5) return 'SW';
                        else if (value > 247.5 && value <= 292.5) return 'W';
                        else if (value > 292.5 && value <= 337.5) return 'Nw';
                        else return value;
                    case SensorType.WindSpeed:
                        return value + ' mph'
                    case SensorType.Ammonia:
                    case SensorType.CO2:
                    case SensorType.CO:
                    case SensorType.PPM:
                        return value + " PPM"
                    case SensorType.PressureGuage:
                        return value + " PSI"
                    case SensorType.Current:
                        return value + " Amps"
                    case SensorType.VoltageSensor:
                        return value + " V"
                    case SensorType.RainPrecipitationSensor:
                        if(!control) return;
                        if(control.lengthUnits == 'Inches') return (value * 0.039370).toFixed(2) + 'in/h';
                        return value + ' mm/h'
                    case SensorType.ElectricMeterSensor:
                        return value + ' kWh'
                    case SensorType.GasMeterSensor:
                        return value + ' Ft³/Min'
                    case SensorType.PH:
                        return value;
                    case SensorType.EC:
                        return (value) + ' ' + args[3];
                    case SensorType.ORP:
                        return value + 'mV';
                    default:
                        //return value + "∞";
                        return value;
                }
            } else {
                var deviceType: DeviceType = args[1];
                let control = (<Control>args[2])
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
                        return (value == 1) ? "On" : "Off";
                    case DeviceType.VariableCardVariableFanDevice:
                    case DeviceType.VariableCurrentCardVariableHeaterDevice:
                    case DeviceType.VariableCurrentCardVariableFanDevice:
                    case DeviceType.VariableCardHeatLampDevice:
                    case DeviceType.LightDevice:
                    case DeviceType.SlideDevice:
                    case DeviceType.VariableDoserDevice:
                        return (value * 1).toFixed(1) + ' %'
                    case DeviceType.FanGroupDevice:
                        return (value * 1).toFixed(1) + ' CFM'
                    case DeviceType.CurtainCardCurtainDevice:
                    case DeviceType.CurtainDeviceV2:
                        if (!control) return (value / 25.4).toFixed(1) + ' in';
                        if (Number(control.version?.split('.')[2]) >= 71) return value + ' %';
                        return (value / 25.4).toFixed(1) + ' in';
                    case DeviceType.BinSlideDevice:
                        return '- -';
                    default:
                        //return value + "∞"
                        return value;
                }
            }
        } else return "";
    }

}
