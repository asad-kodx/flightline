import { Pipe, PipeTransform } from '@angular/core';
import { DeviceType } from '../../models';

@Pipe({
  name: 'deviceIcon',
  standalone: false
})
export class DeviceIconPipe implements PipeTransform {

  private readonly iconMap: Record<DeviceType, string> = {
    // Fan Devices
    [DeviceType.DualRelayCardBooleanFanDevice]: 'custom-device-fan',
    [DeviceType.OctoRelayCardBooleanFanDevice]: 'custom-device-fan',
    [DeviceType.QuadRelayCardBooleanFanDevice]: 'custom-device-fan',
    [DeviceType.VariableCardVariableFanDevice]: 'custom-device-fan',
    [DeviceType.VariableCurrentCardVariableFanDevice]: 'custom-device-fan',
    [DeviceType.FanGroupDevice]: 'custom-device-fan',
    [DeviceType.BooleanRelayFanDevice]: 'custom-device-fan',

    // Fogger Devices
    [DeviceType.DualRelayCardBooleanFoggerDevice]: 'custom-device-fogger',
    [DeviceType.QuadRelayCardBooleanFoggerDevice]: 'custom-device-fogger',
    [DeviceType.BooleanRelayFoggerDevice]: 'custom-device-fogger',

    // Motor Devices
    [DeviceType.QuadRelayCardBooleanMotorDevice]: 'custom-device-feed-motor',
    [DeviceType.DualRelayCardBooleanMotorDevice]: 'custom-device-feed-motor',
    [DeviceType.BooleanRelayMotorDevice]: 'custom-device-feed-motor',
    [DeviceType.GenericBooleanMotorDevice]: 'custom-device-feed-motor',

    // Process Devices
    [DeviceType.GenericProcessDevice]: 'custom-device-feed-process',
    [DeviceType.MixingProcessDevice]: 'custom-device-mixing',
    [DeviceType.BatchTankProcessDevice]: 'custom-device-batch-tank',

    // Special
    [DeviceType.BallDropDevice]: 'custom-device-ball-drop',

    // Heater Devices
    [DeviceType.QuadRelayCardBooleanHeaterDevice]: 'custom-device-heater',
    [DeviceType.DualRelayCardBooleanHeaterDevice]: 'custom-device-heater',
    [DeviceType.OctoRelayCardBooleanHeaterDevice]: 'custom-device-heater',
    [DeviceType.VariableCardHeatLampDevice]: 'custom-device-heater',
    [DeviceType.VariableCurrentCardVariableHeaterDevice]: 'custom-device-heater',
    [DeviceType.BooleanRelayHeaterDevice]: 'custom-device-heater',

    // Lights
    [DeviceType.LightDevice]: 'custom-device-light',

    // Curtains
    [DeviceType.CurtainCardCurtainDevice]: 'custom-device-curtain',
    [DeviceType.CurtainDeviceV2]: 'custom-device-curtain',

    // SMS
    [DeviceType.SingleSmsDevice]: 'custom-device-smsy',

    // Timers
    [DeviceType.ClockDevice]: 'custom-device-clock',
    [DeviceType.DayTimerDevice]: 'custom-device-clock',
    [DeviceType.CycleTimerDevice]: 'custom-device-clock',
    [DeviceType.PercentCycleTimerDevice]: 'custom-device-clock',

    // Switch / Alarm
    [DeviceType.AlarmDevice]: 'custom-device-switch-on',
    [DeviceType.SwitchDevice]: 'custom-device-switch-on',
    [DeviceType.ChainDiskDevice]: 'custom-device-switch-on',

    // Slide
    [DeviceType.SlideDevice]: 'custom-device-bin-slide',
    [DeviceType.BinSlideDevice]: 'custom-device-slide-process',

    // Valves
    [DeviceType.BooleanValveDevice]: 'custom-device-valve',

    // Dosers
    [DeviceType.BooleanDoserDevice]: 'custom-device-doser',
    [DeviceType.VariableDoserDevice]: 'custom-device-doser',
    [DeviceType.AbstractDevice]: '',
    [DeviceType.VirtualDeviceMask]: '',
    [DeviceType.RemoteDevice]: ''
  };

  transform(value: DeviceType): string | null {
    return this.iconMap[value] || null;
  }
}
