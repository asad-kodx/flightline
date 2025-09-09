import { Pipe, PipeTransform } from '@angular/core';
import { CalibrationStatus } from '../../models/types/calibration-status';

@Pipe({
  name: 'CalibrationStatus',
  standalone: false,
})
export class CalibrationStatusPipe implements PipeTransform {
  transform(value: CalibrationStatus | null | undefined): string {
    if (value == null) {
      return 'Unknown';
    }
    
    switch (value) {
      case CalibrationStatus.Calibrated:
        return 'Calibrated';
      case CalibrationStatus.Calibrating:
        return 'Calibrating';
      case CalibrationStatus.NotCalibrated:
        return 'Not Calibrated';
      default:
        return 'Unknown';
    }
  }
}
