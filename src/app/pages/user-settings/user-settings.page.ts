import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { AlarmDataProvider } from 'src/app/core/providers/alarm-data.provider';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { OrganizationDataProvider } from 'src/app/core/providers/org-data.provider';
import { SiteDataProvider } from 'src/app/core/providers/site-data.provider';
import { LocalStorageHelper } from 'src/app/core/providers/storage-helper.provider';
import { DBKeys, Organization } from 'src/app/shared/models';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
  standalone: false
})
export class UserSettingsPage implements OnInit {

  public organizations?: Observable<Organization[]>;
  public orgName?: string;
  public orgId?: number;
  private sub?: Subscription;
  public allOrgs: Organization;
  public searchText = "";

  constructor(
    private navCtrl: NavController,
    private siteData: SiteDataProvider,
    private localStorage: LocalStorageHelper,
    private controlData: ControlDataProvider,
    private alarmData: AlarmDataProvider,
    private orgs: OrganizationDataProvider,

  ) { 
    this.organizations = this.orgs.getOrganizationsBinding();
    this.allOrgs = new Organization('All Organizations', -1);
    this.orgs.getOrganizations();
    this.orgId = this.localStorage.getData(DBKeys.SELECTED_ORG_ID);
    this.orgName = this.localStorage.getData(DBKeys.SELECTED_ORG_NAME);
    if(!this.orgId) 
      this.organizations?.subscribe((orgs: any[]) => {
        if (orgs && orgs.length > 0) {
          this.orgId = orgs[0].organizationId;
          this.orgName = orgs[0].name;
        }
      });
    //   this.organizations!.map(orgs => {
    //     this.orgId = orgs[0].organizationId;
    // });
    // this.events.subscribe("OrgCreated", data => {
    //     console.info("org creation data", data);
    // })
  }

  ngOnInit() {
  }

  public onSelectionChanged(selection: any) {
      console.log('Selection Changed >>> ', selection);
      localStorage.setItem(DBKeys.SELECTED_ORG_ID, selection);
      this.siteData.getSites();
  }

  public changeOrg(organization: Organization, event: any){
      console.log(event)
      if(this.orgId == organization.organizationId) event.preventDefault();
      this.orgId = organization.organizationId;
      this.orgName = organization.name;
      console.log("new org Id", this.orgId, organization.organizationId)
      localStorage.setItem(DBKeys.SELECTED_ORG_ID, organization.organizationId!.toString());
      localStorage.setItem(DBKeys.SELECTED_ORG_NAME, organization.name!);
      this.siteData.getSites();
      // this.events.publish("OrgChange")
      this.controlData.getControls()?.subscribe();
      this.alarmData.getAlarms()?.subscribe();
      this.navCtrl.navigateRoot('home-page')

  }


  isChecked(organization: Organization){
      if(!organization) return 'radio-button-off'
      if(organization.organizationId == this.orgId) return 'checkmark-circle';
      return 'radio-button-off';
  }
}
