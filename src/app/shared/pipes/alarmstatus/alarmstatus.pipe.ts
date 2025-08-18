import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlarmState, ControlAlarm } from '../../models';

@Pipe({
  name: 'AlarmStateActive',
  standalone: false
})
export class AlarmStateActivePipe implements PipeTransform {

  transform(value: ControlAlarm[] | null, args: any) {
    if (value) {
        return value.filter(a =>
            a.state === AlarmState.Active ||
            a.state === AlarmState.Acknowledged
        );
    }
    return [];
  }
}

@Pipe({ name: 'AlarmStateOther', standalone: false })
export class AlarmStateOtherPipe implements PipeTransform {
    transform(value: ControlAlarm[] | null, args: any) {
        if (value !== null) {
            return value.filter((a: ControlAlarm) => {
              return a.state === AlarmState.Resolved;
            });
        }
        return [];
    }
}
