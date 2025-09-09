import { Pipe, PipeTransform } from '@angular/core';
import { Organization } from '../../models';

@Pipe({
  name: 'OrgSearch',
  standalone: false
})
export class OrgSearchPipe implements PipeTransform {

  transform(data: Organization[] | null | undefined, searchTerm: string | null | undefined): Organization[] {
      if (!data || !searchTerm || searchTerm.trim() === '') {
          return data || [];
      }
      
      const searchTermLower = searchTerm.toLowerCase();
      return data.filter((org: Organization) => 
          org.name?.toLowerCase().includes(searchTermLower) ?? false
      );
  }

}
