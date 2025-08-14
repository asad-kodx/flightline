import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../../models';
import * as _ from 'lodash'

@Pipe({
  name: 'OrgSearch',
  standalone: false
})
export class OrgSearchPipe implements PipeTransform {

  transform(data: Observable<Organization>, searchTerm: string) {
      return _.filter(data, (org: Organization) => 
          org.name!.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
  }

}
