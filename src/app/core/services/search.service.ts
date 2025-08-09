import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";


@Injectable()
export class SearchService {
    constructor() {

    }

    filterObservable(searchTerm: string, data: BehaviorSubject<Array<any>>, searchFields: string[]) {
        if (searchTerm === null ||
            searchTerm === undefined ||
            searchTerm === '') return data;

        if (!data) return data;
        
        var results = [];
        return data.map(items => {
            items.filter(item => {
                searchFields.forEach((field) => {
                    if(item[field]
                        .toString()
                        .toLowerCase()
                        .indexOf(searchTerm) > -1) return item;
                })
            })
        })
       
    }
}
