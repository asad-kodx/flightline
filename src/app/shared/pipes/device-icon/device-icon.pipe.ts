import { Pipe, PipeTransform } from '@angular/core';
import { DeviceType } from '../../models';

@Pipe({
  name: 'DeviceDisplayIcon',
  standalone: false
})
export class DeviceIconPipe implements PipeTransform {

  transform(_value: any, args: any[] | null | undefined): string {
      if (!args || args.length === 0) {
          return 'custom-device-default';
      }
      
      const devType = args[0] as DeviceType;
      switch (devType) {
          case DeviceType.DualRelayCardBooleanFanDevice:
          case DeviceType.OctoRelayCardBooleanFanDevice:
          case DeviceType.QuadRelayCardBooleanFanDevice:
          case DeviceType.VariableCardVariableFanDevice:
          case DeviceType.VariableCurrentCardVariableFanDevice:
          case DeviceType.FanGroupDevice:
          case DeviceType.BooleanRelayFanDevice:
              return 'custom-device-fan';
          case DeviceType.DualRelayCardBooleanFoggerDevice:
          case DeviceType.QuadRelayCardBooleanFoggerDevice:
          case DeviceType.BooleanRelayFoggerDevice:
              return 'custom-device-fogger';
          case DeviceType.QuadRelayCardBooleanMotorDevice:
          case DeviceType.DualRelayCardBooleanMotorDevice:
          case DeviceType.BooleanRelayMotorDevice:
          case DeviceType.GenericBooleanMotorDevice:
              return 'custom-device-feed-motor';
          case DeviceType.GenericProcessDevice:
              return 'custom-device-feed-process';
          case DeviceType.BallDropDevice:
              return 'custom-device-ball-drop';
          case DeviceType.QuadRelayCardBooleanHeaterDevice:
          case DeviceType.DualRelayCardBooleanHeaterDevice:
          case DeviceType.OctoRelayCardBooleanHeaterDevice:
          case DeviceType.VariableCardHeatLampDevice:
          case DeviceType.VariableCurrentCardVariableHeaterDevice:
          case DeviceType.BooleanRelayHeaterDevice:
              return 'custom-device-heater';
          case DeviceType.LightDevice:
              return 'custom-device-light';
          case DeviceType.CurtainCardCurtainDevice:
          case DeviceType.CurtainDeviceV2:
              return 'custom-device-curtain';
          case DeviceType.SingleSmsDevice:
              return 'custom-device-smsy';
          case DeviceType.ClockDevice:
          case DeviceType.DayTimerDevice:
          case DeviceType.CycleTimerDevice:
          case DeviceType.PercentCycleTimerDevice:
              return 'custom-device-clock';
          case DeviceType.AlarmDevice:
          case DeviceType.SwitchDevice:
          case DeviceType.ChainDiskDevice:
              return 'custom-device-switch-on';
          case DeviceType.SlideDevice:
              return 'custom-device-bin-slide';
          case DeviceType.BinSlideDevice:
              return 'custom-device-slide-process';
          case DeviceType.BooleanValveDevice:
              return 'custom-device-valve';
          case DeviceType.MixingProcessDevice:
              return 'custom-device-mixing';
          case DeviceType.BooleanDoserDevice:
          case DeviceType.VariableDoserDevice:
              return 'custom-device-doser';
          case DeviceType.BatchTankProcessDevice:
              return 'custom-device-batch-tank';
          default:
              return 'custom-device-default';
      }
  }
}
