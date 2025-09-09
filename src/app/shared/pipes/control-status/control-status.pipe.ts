import { Pipe, PipeTransform } from '@angular/core';
import { Control } from '../../models';
import * as moment from 'moment';

@Pipe({ name: 'OnlineFilter', standalone: false })
export class OnlineFilter implements PipeTransform {
  transform(value: Control[] | null, _args?: any): Control[] {
    if (!value) return [];
    return value.filter(ctrl => {
      const httpDiff = moment().diff(moment(ctrl.lastHttpPing), 'minutes');
      const mqttDiff = moment().diff(moment(ctrl.lastMqttPing), 'minutes');
      // Online if either ping is within the last 5 minutes
      return httpDiff <= 5 || mqttDiff <= 5;
    });
  }
}

@Pipe({ name: 'OfflineFilter', standalone: false })
export class OfflineFilter implements PipeTransform {
  transform(value: Control[] | null): Control[] {
    if (!value) return [];
    return value.filter(ctrl => {
      const httpDiff = moment().diff(moment(ctrl.lastHttpPing), 'minutes');
      const mqttDiff = moment().diff(moment(ctrl.lastMqttPing), 'minutes');
      // Offline if both pings are older than 5 minutes
      return httpDiff > 5 && mqttDiff > 5;
    });
  }
}

@Pipe({ name: 'FavoriteFilter', standalone: false })
export class FavoriteFilter implements PipeTransform {
  transform(value: Control[] | null, _args?: any): Control[] {
    if (!value) return [];
    return value.filter(ctrl => ctrl.isFavorite);
  }
}

@Pipe({ name: 'NonFavoriteFilter', standalone: false })
export class NonFavoriteFilter implements PipeTransform {
  transform(value: Control[] | null, _args?: any): Control[] {
    if (!value) return [];
    return value.filter(ctrl => !ctrl.isFavorite);
  }
}
