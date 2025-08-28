import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { DBKeys, Site } from "../../shared/models/index";



@Injectable({
    providedIn: 'root'
})
export class SiteContextService {
    private sites$: Subject<number[]>;
    private selectedSitesMap?: Map<number, number[]>;

    constructor() {
        this.sites$ = new BehaviorSubject<number[]>([]);
        let siteIds = localStorage.getItem(DBKeys.SELECTED_SITE_IDS);

        if (!siteIds) {
            // handle no sites selected
        }
    }

    public get selectedSiteIds(): number[] {
        return this.getSelectedSiteIdsFromLocalStorage();
    }

    public set selectedSiteIds(siteIds: number[]) {
        this.saveSelectedSiteIdsToLocalStorage(siteIds);
        this.siteIdsChanged.next(siteIds);
    }

    public get siteIdsChanged() : Subject<number[]> {
        return this.sites$;
    }

    public addSiteId(siteId: any){
        var list = this.selectedSiteIds;
        list.push(siteId);
        this.selectedSitesMap?.set(Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)), list);
        localStorage.setItem(DBKeys.SELECTED_SITE_IDS, list.toString());
        this.updateSitesMapOnServer();
    }

    public removeSiteId(siteId: any){
        var list = this.selectedSiteIds;
        if(list.length == 1) return;
        list.splice(list.indexOf(siteId), 1);
        this.selectedSitesMap?.set(Number(localStorage.getItem(DBKeys.SELECTED_ORG_ID)), list);
        localStorage.setItem(DBKeys.SELECTED_SITE_IDS, list.toString());
        this.updateSitesMapOnServer();
    }

    public isSiteSelected(siteId: any){
        if(this.selectedSiteIds.indexOf(siteId) > -1) return true;
        return false;
    }

    public newOrgSelected(sites: Site[], orgId: number){
        var list: any = [];
        if(!this.selectedSitesMap){
            window.setTimeout(() => this.newOrgSelected(sites, orgId), 1000)
            return;
        }
        if(this.selectedSitesMap?.has(orgId)){
            list = this.selectedSitesMap?.get(orgId);
        }
        else{
            sites.forEach(site => {
                list.push(site.siteId);
            });
            this.selectedSitesMap?.set(orgId, list);
        }
        localStorage.setItem(DBKeys.SELECTED_SITE_IDS, list.toString());
        this.updateSitesMapOnServer();
    }

    private getSelectedSiteIdsFromLocalStorage(): number[] {
        if(!localStorage.getItem(DBKeys.SELECTED_SITE_IDS)) return [];
        return (localStorage.getItem(DBKeys.SELECTED_SITE_IDS)!.split(',').map(Number));
    }

    private saveSelectedSiteIdsToLocalStorage(selectedSiteIds: number[]) {
        var siteIdsParsed = selectedSiteIds.join();
    }

    public setSitesMapFromServer(settings: any){
        if(!settings) {
            this.selectedSitesMap = new Map<number, number[]>();
            return;
        }
        this.selectedSitesMap = new Map(JSON.parse(settings.value))
    }

    private updateSitesMapOnServer(){
        var mapString = JSON.stringify(Array.from(this.selectedSitesMap!));
        // this.events.publish('UpdateSitesMap', mapString);
    }

    public clearSitesMap(){
        this.selectedSitesMap = undefined;
    }
}