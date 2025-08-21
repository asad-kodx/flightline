import { Pipe, PipeTransform } from '@angular/core';
import { SensorType } from '../../models/types/sensor-type';

@Pipe({
  name: 'SensorDisplayIcon',
  standalone: false
})
export class SensorDisplayIconPipe implements PipeTransform {
  transform(value: SensorType, args: any[]) {
    if(value == null) return null;
    switch (value) {
      case SensorType.AbstractSensor:
        return 'custom-sensor-default';
      case SensorType.Humidity:
        return 'custom-sensor-humidity';
      case SensorType.WaterMeter:
      case SensorType.Moisture:
        return 'custom-sensor-water-meter';
      case SensorType.Oxygen:
        return 'custom-sensor-oxygen';
      case SensorType.Pressure:
      case SensorType.StaticPressure:
        return 'custom-sensor-static-pressure';
      case SensorType.Switch:
      case SensorType.Whisker:
        return 'custom-sensor-switch-on';
      case SensorType.Bin:
        return 'custom-sensor-bin';
      case SensorType.Temperature:
        return 'custom-sensor-temperature';
      case SensorType.WindDirection:
        return 'custom-sensor-wind-direction';
      case SensorType.WindSpeed:
        return 'custom-sensor-wind-speed';
      case SensorType.PressureGuage:
        return 'custom-sensor-pressure-guage';
      case SensorType.Current:
        return 'custom-sensor-current';
      case SensorType.Ammonia:
        return 'custom-sensor-ammonia';
      case SensorType.CO2:
        return 'custom-sensor-CO2';
      case SensorType.VoltageSensor:
        return 'custom-sensor-voltage';
      case SensorType.CO:
        return 'custom-sensor-CO';
      case SensorType.WaterLevel:
        return 'custom-sensor-water-level';
      case SensorType.RainPrecipitationSensor:
        return 'custom-sensor-rain-precipitation';
      case SensorType.ElectricMeterSensor:
        return 'custom-sensor-electric-meter';
      case SensorType.GasMeterSensor:
        return 'custom-sensor-gas-meter';
      case SensorType.PH:
        return 'custom-sensor-ph';
      case SensorType.EC:
        return 'custom-sensor-ec';
      case SensorType.ORP:
        return 'custom-sensor-orp';
      case SensorType.Weight:
        return 'custom-sensor-weight';
      case SensorType.PPM:
        return 'custom-sensor-ppm';
      default:
        return
    }
  }
}
