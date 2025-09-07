import { Pipe, PipeTransform } from '@angular/core';
import { Mode } from '../../models/types/mode';

@Pipe({
  name: 'ModeDisplay',
  standalone: false
})
export class ModePipe implements PipeTransform {

    transform(value: Mode | number | null | undefined, args?: any[]): string | null {
        if (value == null) {
            return null;
        }
        
        // Handle both direct mode value and args array for backward compatibility
        const mode = args && args.length > 0 ? Number(args[0]) : Number(value);
        
        if (isNaN(mode)) {
            return null;
        }

        switch (mode) {
            case Mode.Auto:
                return 'Auto';
            case Mode.Manual:
                return 'Manual';
            case Mode.Stop:
                return 'Stop';
            default:
                return 'Unknown';
        }
    }

}
