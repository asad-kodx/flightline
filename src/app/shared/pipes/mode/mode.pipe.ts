import { Pipe, PipeTransform } from '@angular/core';
import { Mode } from '../../models/types/mode';

@Pipe({
  name: 'mode',
  standalone: false
})
export class ModePipe implements PipeTransform {

    transform(value: any, args: any[]): any {
        if(!args || value == null) return null;
        let mode = Number(<Mode>args[0]);

        switch (mode) {
            case Mode.Auto:
                return 'Auto';
            case Mode.Manual:
                return 'Manual';
            case Mode.Stop:
                return 'Stop';
            default:
                return null;
        }
    }

}
