import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlarmState, ControlAlarm } from '../../models';

@Pipe({
  name: 'AlarmStateActive',
  standalone: false
})
export class AlarmStateActivePipe implements PipeTransform {

  transform(value: ControlAlarm[] | null | undefined) {
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
    transform(value: BehaviorSubject<ControlAlarm[]>, args: any) {
        if (value !== undefined && value.value) {
            return value.value.filter((a: ControlAlarm) => {
              return a.state === AlarmState.Resolved;
            });
        }
        return [];
    }
}
