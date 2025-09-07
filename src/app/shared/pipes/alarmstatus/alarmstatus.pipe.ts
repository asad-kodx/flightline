import { Pipe, PipeTransform } from '@angular/core';
import { AlarmState, ControlAlarm } from '../../models';

@Pipe({
  name: 'AlarmStateActive',
  standalone: false
})
export class AlarmStateActivePipe implements PipeTransform {

  transform(value: ControlAlarm[] | null | undefined): ControlAlarm[] {
    if (!value) {
        return [];
    }
    return value.filter(alarm =>
        alarm.state === AlarmState.Active ||
        alarm.state === AlarmState.Acknowledged
    );
  }
}

@Pipe({ name: 'AlarmStateOther', standalone: false })
export class AlarmStateOtherPipe implements PipeTransform {
    transform(value: ControlAlarm[] | null | undefined): ControlAlarm[] {
        if (!value) {
            return [];
        }
        return value.filter((alarm: ControlAlarm) => 
            alarm.state === AlarmState.Resolved
        );
    }
}
