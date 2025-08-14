import { of, Observable } from "rxjs";
import { first } from "rxjs/operators";

export function emptyNext(): Observable<void> {
	return of(undefined).pipe(first());
}