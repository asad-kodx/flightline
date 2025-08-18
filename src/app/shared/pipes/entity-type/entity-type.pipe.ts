import { Pipe, PipeTransform } from '@angular/core';
import { DeviceType, SensorType } from '../../models';

@Pipe({ name: 'EntityType', standalone: false })
export class EntityTypePipe implements PipeTransform {
    transform(value: any, args: any[]) {
        if (value !== undefined) {
            var type = args[0];
            if (type == 'sensor') {
                var sensorType: SensorType = args[1];
                switch (sensorType) {
                    case SensorType.AbstractSensor:
                        return
                    case SensorType.Humidity:
                        return 'Humidity'
                    case SensorType.WaterMeter:
                        return 'Water Meter';
                    case SensorType.Oxygen:
                        return 'Oxygen'
                    case SensorType.Pressure:
                        return 'Pressure';
                    case SensorType.StaticPressure:
                        return 'Static Pressure';
                    case SensorType.Switch:
                        return 'Switch'
                    case SensorType.Whisker:
                        return 'Whisker';
                    case SensorType.Bin:
                        return 'Bin Sensor';
                    case SensorType.Temperature:
                        return 'Temperature';
                    case SensorType.WindDirection:
                        return 'Wind Direction';
                    case SensorType.WindSpeed:
                        return 'Wind Speed';
                    case SensorType.Current:
                        return 'Current';
                    case SensorType.Ammonia:
                        return 'Ammonia';
                    case SensorType.WaterLevel:
                        return 'Water Level';
                    case SensorType.PressureGuage:
                        return 'Pressure Gauge';
                    case SensorType.CO2:
                        return 'CO2';
                    case SensorType.CO:
                        return 'CO'
                    case SensorType.RainPrecipitationSensor:
                        return 'Rain Precipitation'
                    case SensorType.ElectricMeterSensor:
                        return 'Electric Meter'
                    case SensorType.GasMeterSensor:
                        return 'Gas Meter'
                    case SensorType.VoltageSensor:
                        return 'Voltage'
                    case SensorType.EC:
                        return 'EC';
                    case SensorType.PH:
                        return 'PH';
                    case SensorType.ORP:
                        return 'ORP';
                    case SensorType.Moisture:
                        return 'Moisture'
                    case SensorType.Weight:
                        return 'Weight'
                    case SensorType.PPM:
                        return 'PPM'
                    default:
                        return
                }
            }
            if (type == 'device') {
                var deviceType: DeviceType = args[1];
                switch (deviceType) {
                    case DeviceType.DualRelayCardBooleanFanDevice:
                    case DeviceType.OctoRelayCardBooleanFanDevice:
                    case DeviceType.QuadRelayCardBooleanFanDevice:
                    case DeviceType.BooleanRelayFanDevice:
                        return 'Relay Fan'
                    case DeviceType.VariableCardVariableFanDevice:
                    case DeviceType.VariableCurrentCardVariableFanDevice:
                        return 'Variable Fan'
                    case DeviceType.DualRelayCardBooleanFoggerDevice:
                    case DeviceType.QuadRelayCardBooleanFoggerDevice:
                    case DeviceType.BooleanRelayFoggerDevice:
                        return 'Fogger'
                    case DeviceType.QuadRelayCardBooleanMotorDevice:
                    case DeviceType.DualRelayCardBooleanMotorDevice:
                    case DeviceType.BooleanRelayMotorDevice:
                    case DeviceType.GenericBooleanMotorDevice:
                        return 'Motor'
                    case DeviceType.QuadRelayCardBooleanHeaterDevice:
                    case DeviceType.DualRelayCardBooleanHeaterDevice:
                    case DeviceType.OctoRelayCardBooleanHeaterDevice:
                    case DeviceType.BooleanRelayHeaterDevice:
                        return 'Relay Heater'
                    case DeviceType.VariableCurrentCardVariableHeaterDevice:
                        return 'Variable Heater'
                    case DeviceType.LightDevice:
                        return 'Light'
                    case DeviceType.CurtainCardCurtainDevice:
                    case DeviceType.CurtainDeviceV2:
                        return 'Curtain'
                    case DeviceType.SingleSmsDevice:
                        return 'SMS Device'
                    case DeviceType.PercentCycleTimerDevice:
                    case DeviceType.CycleTimerDevice:
                        return 'Cycle Timer';
                    case DeviceType.SwitchDevice:
                        return 'Switch'
                    case DeviceType.DayTimerDevice:
                        return 'Day Timer';
                    case DeviceType.ChainDiskDevice:
                        return 'Chain Disk';
                    case DeviceType.FanGroupDevice:
                        return 'Fan Group';
                    case DeviceType.BinSlideDevice:
                        return 'Bin Process';
                    case DeviceType.SlideDevice:
                        return 'Bin Slide';
                    case DeviceType.AlarmDevice:
                        return 'Alarm';
                    case DeviceType.ClockDevice:
                        return 'Clock';
                    case DeviceType.BallDropDevice:
                        return 'Ball Drop';
                    case DeviceType.GenericProcessDevice:
                        return 'Generic Process';
                    case DeviceType.BooleanValveDevice:
                        return 'Valve';
                    case DeviceType.BooleanDoserDevice:
                        return 'Doser';
                    case DeviceType.VariableDoserDevice:
                        return 'Variable Doser';
                    case DeviceType.MixingProcessDevice:
                        return 'Mixing Process';
                    case DeviceType.BatchTankProcessDevice:
                        return 'Batch Tank'
                    default:
                        return
                }
            }
        }
      return;
    }
}
