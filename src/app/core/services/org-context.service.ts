import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
// import { Storage } from '@ionic/storage';
// import { DBKeys } from "../models/dbkeys.static";
// import { Events } from "ionic-angular";
import { DBKeys } from "../../shared/models/index";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrgContextService {
    private organization$: Subject<number|undefined>;

    constructor(private authService: AuthService) {
        this.organization$ = new BehaviorSubject<number | undefined>(undefined);
        let orgId = Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID));

        if (!orgId) {
            orgId = 0;
            this.organization$.next(orgId);
        }

        // Subscribe to logout observable
        this.authService.logout$.subscribe(() => {
            this.organization$.next(undefined);
        });
    }

    public get OrganizationId(): number {
        return this.getOrgSelectionFromLocalStorage();
    }

    public get OrganizationChanged(): Subject<number|undefined> {
        return this.organization$;
    }

    public set OrganizationId(orgId: number) {
        this.saveOrgSelectionToLocalStorage(orgId);
        this.organization$.next(orgId);
    }

    private getOrgSelectionFromLocalStorage(): number {
        return Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID));
    }

    private saveOrgSelectionToLocalStorage(orgId: number) {
        localStorage.setItem(DBKeys.SELECTED_ORG_ID, orgId.toString());
    }

}