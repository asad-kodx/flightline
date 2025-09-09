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
    private organizationChange$ = new Subject<{id: number, name: string}>();
    
    // Public observable for organization changes (includes both ID and name)
    public orgChanged$ = this.organizationChange$.asObservable();

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
    
    /**
     * Set organization with both ID and name, emitting change event
     */
    public setOrganization(orgId: number, orgName: string) {
        // Update localStorage
        localStorage.setItem(DBKeys.SELECTED_ORG_ID, orgId.toString());
        localStorage.setItem(DBKeys.SELECTED_ORG_NAME, orgName);
        
        // Emit changes
        this.organization$.next(orgId);
        this.organizationChange$.next({id: orgId, name: orgName});
    }

    private getOrgSelectionFromLocalStorage(): number {
        return Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID));
    }

    private saveOrgSelectionToLocalStorage(orgId: number) {
        localStorage.setItem(DBKeys.SELECTED_ORG_ID, orgId.toString());
    }
    
    /**
     * Get current organization name from localStorage
     */
    public getOrganizationName(): string | null {
        return localStorage.getItem(DBKeys.SELECTED_ORG_NAME);
    }

}