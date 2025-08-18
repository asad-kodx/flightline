import { Pipe, PipeTransform } from '@angular/core';
import { CalibrationStatus } from '../../models/types/calibration-status';

@Pipe({
  name: 'calibrationStatus',
  standalone: false,
})
export class CalibrationStatusPipe implements PipeTransform {
  transform(value: CalibrationStatus) {
    switch (value) {
      case CalibrationStatus.Calibrated:
        return 'Calibrated';
      case CalibrationStatus.Calibrating:
        return 'Calibrating';
      case CalibrationStatus.NotCalibrated:
        return 'Not Calibrated';
    }
  }
}
