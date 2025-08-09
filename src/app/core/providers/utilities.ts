import { Injectable } from '@angular/core';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class Utilities {

    public static JsonTryParse(value: string|null ) {
        try {
            if (value) {
                return JSON.parse(value);
            }
            else {
                return null;
            }
        }
        catch (e) {
            if (value === "undefined") {
                return void 0;
            }

            return value;
        }
    }

}